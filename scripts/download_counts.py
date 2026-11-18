"""Store download clicks and import historical Nginx access logs."""
import argparse
from collections import Counter
from contextlib import closing
from datetime import datetime, timezone
import gzip
from functools import lru_cache
from hashlib import sha256
import json
import logging
import os
from pathlib import Path
import re
import sqlite3
from urllib.parse import parse_qs, unquote

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = '/var/lib/aw-downloads/counts.sqlite3'
ENDPOINT = '/api/structure-downloads'
SCHEMA = '''
CREATE TABLE IF NOT EXISTS download_counts (
    path TEXT PRIMARY KEY,
    historical INTEGER NOT NULL DEFAULT 0,
    live INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS download_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    cutover INTEGER NOT NULL
);
'''
# The request and status fields are in the same positions in CLF and combined.
LOG_DOWNLOAD = re.compile(
    r'^\S+ \S+ \S+ \[([^\]]+)\] "GET (\S+) HTTP/\d+(?:\.\d+)?" 200 \d+(?: |$)'
)


def database_path():
    return Path(os.environ.get('AW_DOWNLOAD_DB', DEFAULT_DB))


def open_database(path):
    return sqlite3.connect(path.resolve().as_uri() + '?mode=rw', uri=True)


def initialize(path, cutover):
    with closing(sqlite3.connect(path)) as db, db:
        db.executescript(SCHEMA)
        # Once set, this boundary must survive process restarts and reimports.
        db.execute('INSERT OR IGNORE INTO download_settings VALUES (1, ?)', (cutover,))
        if db.execute('SELECT cutover FROM download_settings').fetchone()[0] != cutover:
            raise ValueError('The database already has a different cutover timestamp')


def catalogue_paths(root):
    with (root / 'json/structures.json').open(encoding='utf-8') as source:
        catalogue = json.load(source)['data']
    paths = set()
    for record in catalogue.values():
        path = record['path'].removeprefix('./')
        parts = path.split('/')
        if (parts[0] == 'structures' and len(parts) > 1 and
                not {'', '.', '..'}.intersection(parts) and
                not any(char in path for char in ('\\', '\x00')) and
                path.lower().endswith('.aws')):
            paths.add(path)
    return paths


def count_log(log, paths, cutover):
    totals = Counter()
    digest = sha256()
    open_log = gzip.open if log.suffix == '.gz' else open
    with open_log(log, 'rb') as source:
        for line in source:
            digest.update(line)
            match = LOG_DOWNLOAD.match(line.decode('utf-8', errors='replace'))
            if not match:
                continue
            stamp, target = match.groups()
            try:
                url_path = unquote(target.partition('?')[0], errors='strict')
                if not url_path.startswith('/') or url_path[1:] not in paths:
                    continue
                timestamp = datetime.strptime(stamp, '%d/%b/%Y:%H:%M:%S %z')
            except ValueError:
                continue
            if timestamp.timestamp() < cutover:
                totals[url_path[1:]] += 1
    return digest.digest(), totals


def import_history(root, database, logs):
    paths = catalogue_paths(root)
    with closing(open_database(database)) as db:
        cutover = db.execute('SELECT cutover FROM download_settings').fetchone()[0]
        totals = Counter()
        seen = set()
        for log in logs:
            digest, counts = count_log(log, paths, cutover)
            if digest not in seen:
                totals.update(counts)
                seen.add(digest)
        with db:
            # Hold the write lock across comparison and update. Live increments
            # can run during log parsing, but cannot race with these writes.
            db.execute('BEGIN IMMEDIATE')
            previous = db.execute('SELECT path, historical FROM download_counts WHERE historical > 0')
            for path, count in previous:
                if path in paths and totals[path] < count:
                    raise ValueError('History would decrease. Include the older logs from the previous import.')
            db.executemany(
                '''INSERT INTO download_counts (path, historical) VALUES (?, ?)
                   ON CONFLICT(path) DO UPDATE SET historical = excluded.historical''',
                totals.items(),
            )
    return sum(totals.values()), len(totals)


def create_app(root=ROOT, database=None):
    database = database if database is not None else database_path()
    catalogue_file = root / 'json/structures.json'
    @lru_cache(maxsize=1)
    def paths_for_version(mtime_ns, size):
        return catalogue_paths(root)

    def application(environ, start_response):
        def respond(status, payload, extra_headers=()):
            body = json.dumps(payload).encode('utf-8')
            start_response(status, [
                ('Content-Type', 'application/json'),
                ('Content-Length', str(len(body))),
                ('Cache-Control', 'no-store'),
                *extra_headers,
            ])
            return [body]

        if environ['PATH_INFO'] != ENDPOINT:
            return respond('404 Not Found', {'error': 'Unknown endpoint'})
        method = environ['REQUEST_METHOD']
        if method not in ('GET', 'POST'):
            return respond('405 Method Not Allowed', {'error': 'Unsupported method'}, [('Allow', 'GET, POST')])
        try:
            if method == 'POST':
                if environ.get('CONTENT_TYPE', '').split(';', 1)[0] != 'application/json':
                    return respond('415 Unsupported Media Type', {'error': 'Expected JSON'})
                length = int(environ.get('CONTENT_LENGTH') or '0')
                if not 0 < length <= 8192:
                    return respond('400 Bad Request', {'error': 'Invalid request length'})
                payload = json.loads(environ['wsgi.input'].read(length).decode('utf-8'))
                path = payload.get('path') if isinstance(payload, dict) else None
            else:
                paths = parse_qs(environ.get('QUERY_STRING', '')).get('path', [])
                path = paths[0] if len(paths) == 1 else None
        except ValueError:
            return respond('400 Bad Request', {'error': 'Invalid request'})
        if not isinstance(path, str) or not path:
            return respond('400 Bad Request', {'error': 'Expected a structure path'})
        path = path.removeprefix('./')
        try:
            version = catalogue_file.stat()
            if path not in paths_for_version(version.st_mtime_ns, version.st_size):
                return respond('404 Not Found', {'error': 'Unknown structure'})
            if method == 'POST':
                file = (root / path).resolve()
                if not file.is_relative_to((root / 'structures').resolve()) or not file.is_file():
                    return respond('404 Not Found', {'error': 'Structure file unavailable'})
            with closing(open_database(database)) as db, db:
                if method == 'POST':
                    db.execute(
                        '''INSERT INTO download_counts (path, live) VALUES (?, 1)
                           ON CONFLICT(path) DO UPDATE SET live = live + 1''',
                        (path,),
                    )
                row = db.execute('SELECT historical + live FROM download_counts WHERE path = ?', (path,)).fetchone()
        except (OSError, ValueError, RuntimeError, sqlite3.Error):
            logging.exception('Unable to read or update structure download counts')
            return respond('503 Service Unavailable', {'error': 'Download counts unavailable'})
        return respond('200 OK', {'downloads': row[0] if row else 0})

    return application


def parse_cutover(value):
    timestamp = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if timestamp.utcoffset() is None or timestamp.microsecond:
        raise argparse.ArgumentTypeError('Use an ISO 8601 timestamp with a time zone and whole seconds')
    return int(timestamp.timestamp())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', type=Path, default=database_path())
    parser.add_argument('--site-root', type=Path, default=ROOT)
    commands = parser.add_subparsers(dest='command', required=True)
    init = commands.add_parser('init', help='Create the database and store the historical cutoff')
    init.add_argument('--cutover', type=parse_cutover, required=True)
    history = commands.add_parser('import-history', help='Import current and rotated access logs')
    history.add_argument('logs', type=Path, nargs='+')
    args = parser.parse_args()
    try:
        if args.command == 'init':
            initialize(args.db, args.cutover)
            print('Historical cutoff:', datetime.fromtimestamp(args.cutover, timezone.utc).isoformat())
        else:
            downloads, structures = import_history(args.site_root, args.db, args.logs)
            print(f'Imported {downloads:,} historical downloads across {structures:,} structures.')
    except (OSError, ValueError, sqlite3.Error, EOFError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()

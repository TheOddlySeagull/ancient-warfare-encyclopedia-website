import gzip
import io
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from urllib.parse import quote, urlencode

from scripts.download_counts import ENDPOINT, create_app, import_history, initialize, parse_cutover


FIRST = 'structures/Pack A/Tour + é.aws'
SECOND = 'structures/Pack B/Tour + é.aws'
MISSING = 'structures/Pack B/Missing.aws'
CUTOFF = parse_cutover('2026-11-18T12:00:00Z')


class DownloadCountsTests(unittest.TestCase):
    def setUp(self):
        temporary = TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.database = self.root / 'counts.sqlite3'
        catalogue = self.root / 'json/structures.json'
        catalogue.parent.mkdir()
        catalogue.write_text(json.dumps({'data': {
            'first': {'path': './' + FIRST},
            'second': {'path': SECOND},
            'missing': {'path': MISSING},
        }}), encoding='utf-8')
        for path in (FIRST, SECOND):
            file = self.root / path
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text('fixture', encoding='utf-8')
        initialize(self.database, CUTOFF)
        self.app = create_app(self.root, self.database)

    def request(self, method, path):
        body = json.dumps({'path': path}).encode()
        response = {}

        def start_response(status, headers):
            response.update(status=int(status.split()[0]), headers=dict(headers))

        chunks = self.app({
            'PATH_INFO': ENDPOINT,
            'REQUEST_METHOD': method,
            'CONTENT_TYPE': 'application/json',
            'CONTENT_LENGTH': str(len(body)),
            'QUERY_STRING': urlencode({'path': path}),
            'wsgi.input': io.BytesIO(body),
        }, start_response)
        self.assertEqual(response['headers']['Cache-Control'], 'no-store')
        return response['status'], json.loads(b''.join(chunks))

    def log_line(self, path, timestamp='18/Nov/2026:12:59:59 +0100', method='GET', status=200):
        return f'127.0.0.1 - - [{timestamp}] "{method} /{quote(path)}?download=1 HTTP/2.0" {status} 42 "-" "-"\n'

    def test_import_existing_logs_without_adding_live_or_duplicate_requests(self):
        current = self.root / 'access.log'
        rotated = self.root / 'access.log.2.gz'
        renamed_copy = self.root / 'old.log'
        current.write_text(
            self.log_line(FIRST) +
            self.log_line(FIRST, timestamp='18/Nov/2026:13:00:00 +0100') +
            self.log_line(FIRST, method='HEAD') +
            self.log_line(FIRST, status=206) +
            self.log_line(FIRST, status=404) +
            self.log_line('downloads/Pack.zip'),
            encoding='utf-8',
        )
        rotated_content = self.log_line(SECOND) * 2
        with gzip.open(rotated, 'wt', encoding='utf-8') as stream:
            stream.write(rotated_content)
        renamed_copy.write_text(rotated_content, encoding='utf-8')

        self.assertEqual(self.request('POST', './' + FIRST), (200, {'downloads': 1}))
        for _ in range(2):
            self.assertEqual(import_history(self.root, self.database, [current, rotated, renamed_copy]), (3, 2))
            self.assertEqual(self.request('GET', FIRST), (200, {'downloads': 2}))
            self.assertEqual(self.request('GET', SECOND), (200, {'downloads': 2}))
        with self.assertRaisesRegex(ValueError, 'History would decrease'):
            import_history(self.root, self.database, [current])
        self.assertEqual(self.request('GET', SECOND), (200, {'downloads': 2}))

    def test_only_live_posts_for_available_catalogue_files_increment(self):
        self.assertEqual(self.request('GET', FIRST), (200, {'downloads': 0}))
        self.assertEqual(self.request('GET', FIRST), (200, {'downloads': 0}))
        self.assertEqual(self.request('POST', MISSING)[0], 404)
        self.assertEqual(self.request('GET', MISSING), (200, {'downloads': 0}))
        self.assertEqual(self.request('POST', 'structures/../README.md')[0], 404)
        with ThreadPoolExecutor(max_workers=6) as pool:
            responses = list(pool.map(lambda _: self.request('POST', FIRST), range(12)))
        self.assertEqual(sorted(body['downloads'] for status, body in responses if status == 200), list(range(1, 13)))
        self.assertEqual(self.request('GET', FIRST), (200, {'downloads': 12}))

    def test_cutover_cannot_change_on_reinitialization(self):
        initialize(self.database, CUTOFF)
        with self.assertRaisesRegex(ValueError, 'different cutover'):
            initialize(self.database, CUTOFF + 1)

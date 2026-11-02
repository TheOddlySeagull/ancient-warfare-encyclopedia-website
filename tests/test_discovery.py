"""Check generated discovery pages against catalogue identity and URL escaping."""
import importlib.util
import json
import tempfile
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('discovery', ROOT / 'scripts/generate_discovery.py')
discovery = importlib.util.module_from_spec(spec)
spec.loader.exec_module(discovery)


class Links(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.hrefs = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            self.hrefs.append(dict(attrs).get('href', ''))


def structure_keys(source):
    return [parse_qs(urlsplit(href).query)['structureName'][0]
            for href in Links(source).hrefs
            if urlsplit(href).path == 'structure.html']


class DiscoveryTests(unittest.TestCase):
    def test_committed_index_covers_every_record_once(self):
        records = json.loads((ROOT / 'json/structures.json').read_text())['data']
        keys = structure_keys((ROOT / 'html/structure-index.html').read_text())
        self.assertEqual(len(keys), len(records))
        self.assertEqual(set(keys), set(records))

    def test_escaping_duplicate_names_and_deterministic_generation(self):
        records = {
            'Pack & A/Build #1': {'pack': 'Pack & A', 'name': '<Castle>', 'validation': {'structureAuthor': 'A & B'}},
            'Pack é/Build ?2': {'pack': 'Pack é', 'name': '<Castle>', 'validation': {'structureAuthor': 'A & B'}},
        }
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'json').mkdir()
            (root / 'html').mkdir()
            (root / 'json/structures.json').write_text(json.dumps({'data': records}))
            discovery.generate(root)
            index = (root / 'html/structure-index.html').read_text()
            landing = (root / 'index.html').read_text()
            self.assertCountEqual(structure_keys(index), records)
            self.assertIn('&lt;Castle&gt;', index)
            self.assertNotIn('<Castle>', index)
            self.assertIn('html/author.html?author=A+%26+B', Links(landing).hrefs)
            self.assertIn('html/package.html?packName=Pack+%26+A', Links(landing).hrefs)
            self.assertIn('html/structure-index.html', Links(landing).hrefs)
            self.assertIn('https://www.curseforge.com/minecraft/mc-mods/ancient-warfare-2', Links(landing).hrefs)
            self.assertNotIn('<script', landing)
            discovery.generate(root)
            self.assertEqual(index, (root / 'html/structure-index.html').read_text())
            self.assertEqual(landing, (root / 'index.html').read_text())

    def test_committed_pages_are_current(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'json').mkdir()
            (root / 'html').mkdir()
            (root / 'json/structures.json').write_bytes((ROOT / 'json/structures.json').read_bytes())
            discovery.generate(root)
            for name in ('index.html', 'html/structure-index.html'):
                self.assertEqual((root / name).read_bytes(), (ROOT / name).read_bytes(), name)


if __name__ == '__main__':
    unittest.main()

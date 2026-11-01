#!/usr/bin/env python3
"""Generate the public landing page and crawlable text index from the catalogue."""
import json
from collections import Counter, defaultdict
from html import escape
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://ancient-warfare.legends-of-gramdatis.com/'


def page(title, description, content, nested=False, filename=''):
    prefix = '../' if nested else ''
    html_prefix = '' if nested else 'html/'
    navigation = ''.join(f'<a href="{html_prefix}{url}">{label}</a>' for url, label in
                         [('home.html', 'Structures'), ('package.html', 'Packs'), ('author.html', 'Authors'), ('structure-index.html', 'Text index'), ('about.html', 'About')])
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{escape(title)}</title>
    <meta name="description" content="{escape(description, quote=True)}">
    <link rel="canonical" href="{SITE}{filename}">
    <link rel="icon" href="{prefix}img/AW2.png">
    <link rel="stylesheet" href="{prefix}css/discovery.css">
</head>
<body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header><a class="site-name" href="{prefix}index.html">Ancient Warfare Structures Encyclopedia</a><nav aria-label="Main navigation">{navigation}</nav></header>
    <main id="main-content">{content}</main>
    <footer>A community project maintained by <a href="{html_prefix}author.html?author=TheOddlySeagull">TheOddlySeagull</a>. Structure credits belong to their respective builders.</footer>
</body>
</html>
'''


def generate(root=ROOT):
    records = json.loads((root / 'json/structures.json').read_text(encoding='utf-8'))['data']
    packs = defaultdict(list)
    authors = Counter()
    for key, record in records.items():
        packs[record['pack']].append((key, record))
        author = record.get('validation', {}).get('structureAuthor')
        if isinstance(author, str) and author.strip() and author.strip().lower() not in ['unknown', 'undefined', 'null']:
            authors[author.strip()] += 1
    pack_links = ''.join(f'<li><a href="html/package.html?{escape(urlencode({"packName": name}), quote=True)}">{escape(name)}</a></li>\n' for name in sorted(packs))
    author_links = ''.join(f'<li><a href="html/author.html?{escape(urlencode({"author": name}), quote=True)}">{escape(name)}</a></li>\n' for name in sorted(authors, key=lambda name: (-authors[name], name))[:3])
    content = f'''
<section class="intro">
    <p class="eyebrow">COMMUNITY STRUCTURE CATALOGUE FOR MINECRAFT</p>
    <h1>Explore structures for Ancient Warfare 2</h1>
    <p>The Ancient Warfare Structures Encyclopedia is a community catalogue of downloadable structures and structure packs for the <a href="https://www.curseforge.com/minecraft/mc-mods/ancient-warfare-2">Ancient Warfare 2 (AW2) Minecraft mod</a>. Discover builds, see who made them, and find packs to try in your world.</p>
    <p>Maintained by TheOddlySeagull, this encyclopedia is a separate community website, not the mod itself. Its catalogue includes survival builds and world-generation structures, with metadata such as size, author, required mods, and generation settings where available.</p>
    <a class="primary-link" href="html/home.html">Browse the structure catalogue →</a>
</section>
<div class="overview-grid">
<section><h2>Structure packs</h2><p>Explore the packs currently represented in the catalogue.</p><ul>{pack_links}</ul></section>
<section><h2>Meet the builders</h2><p>Find work by community creators and explore their contributions.</p><ul>{author_links}</ul><a href="html/author.html">View all authors →</a></section>
</div>
<section><h2>Find a structure</h2><p>Use the <a href="html/home.html">searchable catalogue</a> to browse builds, illustrations, sizes and generation information. For a complete list of structure links without JavaScript, open the <a href="html/structure-index.html">text-only structure index</a>.</p><p>Check each structure's required mods and its source pack's instructions before installing. The catalogue does not guarantee compatibility with other Minecraft versions or AW2 ports.</p></section>
<section><h2>About the projects</h2><p>Learn about the mod on the <a href="https://www.curseforge.com/minecraft/mc-mods/ancient-warfare-2">Ancient Warfare 2 project page</a>. Website source and contributions are available in the <a href="https://github.com/TheOddlySeagull/ancient-warfare-encyclopedia-website">encyclopedia GitHub repository</a>.</p><p>Example pack source repositories: <a href="https://github.com/TheOddlySeagull/Seagull-Survival-Structure-Pack">Seagull's Survival Structure Pack</a> and <a href="https://github.com/TheOddlySeagull/Seagull-s-WorldG-Structure-Pack">Seagull's WorldG Structure Pack</a>.</p></section>
'''
    (root / 'index.html').write_text(page('Ancient Warfare 2 Structures & Packs | Ancient Warfare Structures Encyclopedia', 'A community catalogue of structures and structure packs for the Ancient Warfare 2 Minecraft mod. Browse builds, authors, illustrations and pack downloads.', content), encoding='utf-8')
    sections = []
    for name in sorted(packs):
        links = ''.join(f'<li><a href="structure.html?{escape(urlencode({"structureName": key}), quote=True)}">{escape(record.get("name") or key)}</a></li>\n' for key, record in sorted(packs[name], key=lambda row: ((row[1].get('name') or row[0]).lower(), row[0])))
        pack_url = 'package.html?' + urlencode({'packName': name})
        sections.append(f'<details><summary>{escape(name)} — {len(packs[name]):,} {"structure" if len(packs[name]) == 1 else "structures"}</summary><p><a href="{escape(pack_url, quote=True)}">About this structure pack</a></p><ul>{links}</ul></details>')
    content = '<h1>Ancient Warfare 2 structure index</h1><p>A complete text index of the structures in this community catalogue. Expand a pack to browse its builds, or use the <a href="home.html">searchable catalogue</a> for illustrations and search tools.</p>' + '\n'.join(sections)
    (root / 'html/structure-index.html').write_text(page('AW2 Structure Index | Ancient Warfare Structures Encyclopedia', 'Browse every catalogued Ancient Warfare 2 structure, grouped by pack, with links to structure details.', content, nested=True, filename='html/structure-index.html'), encoding='utf-8')


if __name__ == '__main__':
    generate()

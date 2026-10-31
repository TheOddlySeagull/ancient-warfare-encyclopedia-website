import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../js/catalogue.js', import.meta.url), 'utf8')
    .replace("new URL('../', import.meta.url)", "new URL('https://example.test/encyclopedia/')");
async function moduleFor(suffix) {
    return import('data:text/javascript;base64,' + Buffer.from(source + '\n//' + suffix).toString('base64'));
}

test('fresh-page loading preserves duplicate names, normalizes artwork and encodes canonical links', async () => {
    let calls = 0;
    globalThis.fetch = async () => { calls++; return { ok: true, json: async () => ({ data: {
        'Pack A/Original&Name': { pack: 'Pack A', name: 'Renamed', icon: 'http://ancient-warfare.legends-of-gramdatis.com/img/structures/a.png' },
        'Pack B/Original': { pack: 'Pack B', name: 'Renamed', icon: '../img/AW2_512.png' }
    } }) }; };
    const api = await moduleFor('success');
    const [data, again] = await Promise.all([api.loadCatalogue(), api.loadCatalogue()]);
    assert.equal(calls, 1);
    assert.equal(data, again);
    assert.equal(Object.keys(data).length, 2);
    assert.equal(data['Pack A/Original&Name'].icon, 'https://example.test/encyclopedia/img/structures/a.png');
    assert.equal(data['Pack B/Original'].icon, 'https://example.test/encyclopedia/img/AW2_512.png');
    const link = new URL(api.structureUrl(data['Pack A/Original&Name']));
    assert.equal(link.searchParams.get('structureName'), 'Pack A/Original&Name');
    assert.equal(api.sitePath('./structures/Pack A/A&B #1.aws'), 'https://example.test/encyclopedia/structures/Pack%20A/A%26B%20%231.aws');
});

test('HTTP failures reject instead of treating error pages as catalogues', async () => {
    globalThis.fetch = async () => ({ ok: false });
    const api = await moduleFor('failure');
    await assert.rejects(api.loadCatalogue(), /Unable to load/);
});

const home = readFileSync(new URL('../js/home.js', import.meta.url), 'utf8');
const randomCode = home.slice(home.indexOf('function createRandomStructureMenuIllustrated()'), home.indexOf('// Function to create a mini menu to let the user choose'));
function randomFixture(data) {
    const created = [];
    const document = { createElement(tag) { const element = {
        tag, children: [], appendChild(child) { this.children.push(child); },
        replaceChildren(...children) { this.children = children; }
    }; created.push(element); return element; } };
    const sidebar = document.createElement('aside');
    const context = { document, pageSizeConfigurator: sidebar, structure_list: data, URL,
        location: { href: 'https://example.test/html/home.html' }, Math: { random: () => 0, floor: Math.floor },
        structureUrl: item => 'canonical:' + item.id, window: { location: {} } };
    vm.runInNewContext(randomCode + '\ncreateRandomStructureMenuIllustrated();', context);
    return { created, panel: sidebar.children[0].children[1], context };
}

test('illustrated random skips placeholders, retries missing art and links the selected record', () => {
    const fixture = randomFixture({
        fallback: { icon: '/img/AW2_512.png' },
        missing: { icon: '/img/structures/missing.png', name: 'Missing', id: 'one' },
        renamed: { icon: '/img/structures/old-name.png', name: 'NewName', id: 'two' }
    });
    const first = fixture.created.find(item => item.tag === 'img');
    assert.equal(first.src, '/img/structures/missing.png');
    first.onerror();
    const second = fixture.created.filter(item => item.tag === 'img')[1];
    second.onload();
    assert.equal(fixture.panel.children[1], second);
    fixture.panel.children[0].onclick();
    assert.equal(fixture.context.window.location.href, 'canonical:two');
});

test('illustrated random handles empty catalogues and exhausted images', () => {
    assert.equal(randomFixture({}).panel.textContent, 'No illustrated structures available.');
    const fixture = randomFixture({ only: { icon: '/img/structures/missing.png', name: 'Missing' } });
    fixture.created.find(item => item.tag === 'img').onerror();
    assert.equal(fixture.panel.textContent, 'No illustrated structures available.');
});

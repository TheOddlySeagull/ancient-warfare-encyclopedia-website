import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
let sequence = 0;
async function images(existing = []) {
    const requests = [];
    let active = 0, peak = 0;
    globalThis.Image = class {
        removeAttribute() {}
        set src(value) {
            this.url = value;
            requests.push(value);
            active++; peak = Math.max(peak, active);
            queueMicrotask(() => {
                active--;
                if (existing.includes(value)) this.onload?.(); else this.onerror?.();
            });
        }
        get src() { return this.url; }
    };
    const source = readFileSync(new URL('../js/structure-images.js', import.meta.url), 'utf8')
        .replace("import { sitePath } from './catalogue.js';", "const sitePath = path => 'https://example.test/wiki/' + path.split('/').map(encodeURIComponent).join('/');");
    const api = await import('data:text/javascript;base64,' + Buffer.from(source + '\n//' + sequence++).toString('base64'));
    return { api, requests, peak: () => peak };
}
const url = name => 'https://example.test/wiki/img/structures/' + encodeURIComponent(name) + '.png';
const record = (name, extra = {}) => ({ name: 'Displayed name', path: 'structures/Pack/' + name + '.aws', icon: '../img/AW2_512.png', ...extra });
const flush = () => new Promise(resolve => setImmediate(resolve));

test('uses template filename and encodes spaces, accents, hashes and Windows separators', async () => {
    const { api } = await images();
    assert.equal(api.structureImageUrl(record('Actual & #é')), url('Actual & #é'));
    assert.equal(api.structureImageUrl({ path: 'structures\\Pack\\Actual.AWS' }), url('Actual'));
    assert.equal(api.structureImageUrl({ name: 'No filename' }), null);
});
test('new artwork displays despite an old placeholder in the cached catalogue', async () => {
    const { api, requests } = await images([url('New')]);
    const image = api.createStructureImage(record('New'));
    await flush();
    assert.equal(image.src, url('New'));
    assert.equal(image.loading, 'lazy');
    assert.equal(image.decoding, 'async');
    assert.deepEqual(requests, [url('New')]);
    const recommendation = api.createStructureImage(record('New'), { lazy: false });
    assert.equal(recommendation.loading, 'eager');
});
test('missing artwork falls back once, even if the fallback is missing too', async () => {
    const { api, requests } = await images();
    const image = api.createStructureImage(record('Missing'));
    await flush();
    assert.equal(image.src, 'https://example.test/wiki/img/AW2_512.png');
    assert.equal(requests.length, 2);
    assert.equal(image.onerror, null);
    api.createStructureImage(record('Missing'));
    await flush();
    assert.equal(requests.filter(value => value === url('Missing')).length, 1);
});
test('illustrated sampling discovers artwork with no catalogue icon hint', async () => {
    const { api } = await images([url('New')]);
    const structure = record('New');
    assert.equal(await api.findIllustratedStructure({ 'Pack/Original': structure }), structure);
});
test('illustrated sampling is bounded, concurrent and deduplicates image URLs', async () => {
    const { api, requests, peak } = await images();
    const catalogue = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [i, record('Missing' + i)]));
    assert.equal(await api.findIllustratedStructure(catalogue), null);
    assert.equal(requests.length, 12);
    assert.ok(peak() <= 3);
    const second = await images();
    await second.api.findIllustratedStructure({ a: record('Shared'), b: record('Shared') });
    assert.equal(second.requests.length, 1);
});
test('missing results expire on the next page rather than hiding later uploads', async () => {
    const first = await images();
    assert.equal(await first.api.findIllustratedStructure({ a: record('Later') }), null);
    const next = await images([url('Later')]);
    assert.equal((await next.api.findIllustratedStructure({ a: record('Later') })).path, record('Later').path);
});
test('an empty catalogue makes no image requests', async () => {
    const { api, requests } = await images();
    assert.equal(await api.findIllustratedStructure({}), null);
    assert.equal(requests.length, 0);
});

test('illustrated sampling reuses known artwork among a large set of stale hints', async () => {
    const { api, requests } = await images([url('Known')]);
    const known = record('Known');
    api.createStructureImage(known);
    await flush();
    const catalogue = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [i, record('Stale' + i, { icon: '../img/structures/Stale' + i + '.png' })]));
    catalogue.known = known;
    assert.equal(await api.findIllustratedStructure(catalogue), known);
    assert.equal(requests.filter(value => value === url('Known')).length, 1);
    assert.ok(requests.length <= 13);
});

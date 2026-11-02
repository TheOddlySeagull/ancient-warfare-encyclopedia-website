import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../js/author-images.js', import.meta.url), 'utf8')
    .replace("import { sitePath } from './catalogue.js';", "const sitePath = path => 'https://example.test/wiki/' + path.split('/').map(encodeURIComponent).join('/');");
const api = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
globalThis.Image = class {
    requests = [];
    set src(value) { this.requests.push(value); this.url = value; }
    get src() { return this.url; }
};

test('author artwork uses the existing profile folder and encodes special characters', () => {
    const image = api.createAuthorImage('A & Bé#1', { decorative: true });
    assert.equal(image.src, 'https://example.test/wiki/img/authors/profiles/A%20%26%20B%C3%A9%231.png');
    assert.equal(image.alt, '');
    assert.equal(image.loading, 'lazy');
    assert.equal(image.decoding, 'async');
});
test('missing author artwork falls back once without recursive fallback requests', () => {
    const image = api.createAuthorImage('Missing', { lazy: false });
    assert.equal(image.loading, 'eager');
    image.onerror();
    assert.equal(image.src, 'https://example.test/wiki/img/AW2.png');
    assert.equal(image.onerror, null);
    assert.equal(image.requests.length, 2);
});
test('unnamed authors use the logo directly', () => {
    for (const name of [null, '', ' ']) {
        const image = api.createAuthorImage(name);
        assert.deepEqual(image.requests, ['https://example.test/wiki/img/AW2.png']);
    }
});

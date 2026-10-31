import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const code = readFileSync(new URL('../js/author-directory-data.js', import.meta.url), 'utf8');
const { summarizeAuthors } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const record = (structureAuthor, pack) => ({ validation: { structureAuthor }, pack });

test('counts every record and each author’s contributions to distinct packs', () => {
    const result = summarizeAuthors({
        'A/same': record('Alice', 'A'), 'B/same': record('Alice', 'B'),
        'A/other': record('Alice', 'A'), 'B/other': record('Bob', 'B')
    });
    assert.equal(result.authors[0].name, 'Alice');
    assert.equal(result.authors[0].count, 3);
    assert.deepEqual(result.authors[0].packs, [{ name: 'A', count: 2 }, { name: 'B', count: 1 }]);
    assert.equal(result.authors[1].count, 1);
});
test('missing credits and placeholder names form a separate unattributed total', () => {
    const result = summarizeAuthors({ a: {}, b: record('', 'A'), c: record(' Unknown ', 'A'),
        d: record('undefined', 'B'), e: record(null, 'A'), f: record('Alice', 'A') });
    assert.equal(result.unattributed, 5);
    assert.deepEqual(result.authors.map(author => author.name), ['Alice']);
    assert.deepEqual(summarizeAuthors({}), { authors: [], unattributed: 0 });
});
test('real catalogue totals reconcile without losing duplicate-named structures', () => {
    const catalogue = JSON.parse(readFileSync(new URL('../json/structures.json', import.meta.url))).data;
    const result = summarizeAuthors(catalogue);
    assert.equal(result.authors.reduce((total, author) => total + author.count, result.unattributed), Object.keys(catalogue).length);
    for (const author of result.authors) assert.equal(author.packs.reduce((total, pack) => total + pack.count, 0), author.count);
});

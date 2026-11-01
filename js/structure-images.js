import { sitePath } from './catalogue.js';

// Deliberately scoped to this page: a missing image may be uploaded before the
// next visit. Never persist negative results in the catalogue or browser storage.
const availability = new Map();
const pending = new Map();
const fallback = () => sitePath('img/AW2_512.png');

export function structureImageUrl(structure) {
    // The template filename can differ from header.name / the displayed name.
    const filename = String(structure.path || '').replace(/\\/g, '/').split('/').pop();
    if (!/\.(aws|awt)$/i.test(filename)) return null;
    return sitePath('img/structures/' + filename.replace(/\.(aws|awt)$/i, '.png'));
}

export function createStructureImage(structure, { lazy = true } = {}) {
    const image = new Image();
    image.alt = structure.name || 'Structure';
    image.loading = lazy ? 'lazy' : 'eager';
    image.decoding = 'async';
    const url = structureImageUrl(structure);
    if (!url || availability.get(url) === false) {
        image.src = fallback();
        return image;
    }
    image.onload = () => availability.set(url, true);
    image.onerror = () => {
        availability.set(url, false);
        image.onload = image.onerror = null; // The fallback must never recurse.
        image.src = fallback();
    };
    image.src = url;
    return image;
}

function probe(url) {
    if (availability.has(url)) return Promise.resolve(availability.get(url));
    if (pending.has(url)) return pending.get(url);
    const promise = new Promise(resolve => {
        const image = new Image();
        let settled = false;
        const finish = available => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            image.onload = image.onerror = null;
            if (!available) image.removeAttribute('src');
            resolve(available);
        };
        // A timeout is inconclusive and must not poison the negative cache.
        const timer = setTimeout(() => finish(false), 2500);
        image.onload = () => { availability.set(url, true); finish(true); };
        image.onerror = () => { availability.set(url, false); finish(false); };
        image.src = url;
    });
    pending.set(url, promise);
    promise.finally(() => pending.delete(url));
    return promise;
}

function shuffle(values) {
    for (let i = values.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [values[i], values[j]] = [values[j], values[i]];
    }
    return values;
}

export async function findIllustratedStructure(structures) {
    // One candidate per URL, including records still carrying the old AW2 icon.
    const candidates = new Map();
    for (const structure of Object.values(structures)) {
        const url = structureImageUrl(structure);
        if (url && availability.get(url) !== false) candidates.set(url, structure);
    }
    const entries = shuffle([...candidates]);
    const confirmed = entries.filter(([url]) => availability.get(url) === true);
    const hinted = entries.filter(([url, structure]) => availability.get(url) !== true && /\/img\/structures\//.test(structure.icon || ''));
    const fresh = entries.filter(([url, structure]) => availability.get(url) !== true && !/\/img\/structures\//.test(structure.icon || ''));
    // Mix fresh discoveries, already loaded artwork and catalogue hints.
    // At most 12 image requests, three at a time.
    // Never scan all thousands of structure images on page load.
    const sample = [...fresh.slice(0, 6), ...confirmed.slice(0, 3)];
    sample.push(...hinted.slice(0, 12 - sample.length));
    for (const entry of entries) {
        if (sample.length >= 12) break;
        if (!sample.includes(entry)) sample.push(entry);
    }
    shuffle(sample);
    for (let i = 0; i < sample.length; i += 3) {
        const batch = sample.slice(i, i + 3);
        const results = await Promise.all(batch.map(([url]) => probe(url)));
        const match = results.findIndex(Boolean);
        if (match !== -1) return batch[match][1];
    }
    return null;
}

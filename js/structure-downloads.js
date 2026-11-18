import { sitePath } from './catalogue.js';

const endpoint = () => sitePath('api/structure-downloads');

async function requestCount(url, options) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) return null;
        const { downloads } = await response.json();
        return Number.isSafeInteger(downloads) && downloads >= 0 ? downloads : null;
    } catch {
        return null;
    }
}

export function getStructureDownloadCount(structure) {
    const url = new URL(endpoint());
    url.searchParams.set('path', structure.path);
    return requestCount(url, { cache: 'no-store' });
}

export function downloadStructure(structure) {
    const count = requestCount(endpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: structure.path }),
        keepalive: true,
    });
    const link = document.createElement('a');
    link.href = sitePath(structure.path);
    link.download = structure.name + '.aws';
    document.body.appendChild(link);
    link.click();
    link.remove();
    return count;
}

// Cache the large catalogue in IndexedDB; check only its small version file on repeat visits.
const root = new URL('../', import.meta.url);
let cataloguePromise;
const keys = new WeakMap();

export function sitePath(path) {
    return new URL(path.replace(/^\.\//, '').split('/').map(encodeURIComponent).join('/'), root).href;
}

export function localIcon(icon) {
    if (!icon) return sitePath('img/AW2_512.png');
    const url = new URL(icon.replace(/^\.\.\/img\//, 'img/'), root);
    if (url.hostname === 'ancient-warfare.legends-of-gramdatis.com') {
        return new URL(url.pathname.replace(/^\//, ''), root).href;
    }
    return url.href;
}

// Storage may be blocked or unavailable. Never let it prevent page loading.
function cachedCatalogue(value) {
    return new Promise(resolve => {
        if (!globalThis.indexedDB) return resolve(null);
        let db;
        let finished = false;
        const finish = result => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);
            if (db) db.close();
            resolve(result);
        };
        const timer = setTimeout(() => finish(null), 1000);
        try {
            const request = indexedDB.open('aw-encyclopedia', 1);
            request.onupgradeneeded = () => request.result.createObjectStore('catalogues');
            request.onerror = request.onblocked = () => finish(null);
            request.onsuccess = () => {
                db = request.result;
                if (finished) { db.close(); return; }
                try {
                    const transaction = db.transaction('catalogues', value ? 'readwrite' : 'readonly');
                    const store = transaction.objectStore('catalogues');
                    transaction.onerror = transaction.onabort = () => finish(null);
                    if (value) {
                        transaction.oncomplete = () => finish(value);
                        store.put(value, root.href);
                    } else {
                        const read = store.get(root.href);
                        read.onsuccess = () => finish(read.result || null);
                        read.onerror = () => finish(null);
                    }
                } catch { finish(null); }
            };
        } catch { finish(null); }
    });
}

async function readCatalogue() {
    const [cached, version] = await Promise.all([
        cachedCatalogue(),
        fetch(new URL('json/structures_version.json', root), { cache: 'no-cache' })
            .then(response => response.ok ? response.json() : null)
            .catch(() => null)
    ]);
    if (cached?.data && version?.version != null &&
        cached.disclamer?.version === version.version) return cached;

    const response = await fetch(new URL('json/structures.json', root), { cache: 'no-cache' });
    if (!response.ok) throw new Error('Unable to load the structure catalogue');
    const catalogue = await response.json();
    if (!catalogue.data || typeof catalogue.data !== 'object') throw new Error('Invalid structure catalogue');
    // Save the original URLs before normalizing records for the current site.
    // Cache writes run in the background so first render need not wait for disk.
    void cachedCatalogue(structuredClone(catalogue));
    return catalogue;
}

export function loadCatalogue() {
    if (!cataloguePromise) cataloguePromise = readCatalogue().then(catalogue => {
        for (const [key, structure] of Object.entries(catalogue.data)) {
            keys.set(structure, key);
            structure.icon = localIcon(structure.icon);
        }
        return catalogue.data;
    });
    return cataloguePromise;
}

export function structureUrl(structure) {
    const key = keys.get(structure) || structure.pack + '/' + structure.name;
    const url = new URL('html/structure.html', root);
    url.searchParams.set('structureName', key);
    return url.href;
}

export function reportCatalogueError(error) {
    console.error(error);
    const target = document.getElementById('structure-list') || document.querySelector('main');
    if (target) {
        const message = document.createElement('p');
        message.textContent = 'The structure catalogue could not be loaded. Please reload to try again.';
        message.setAttribute('role', 'alert');
        target.replaceChildren(message);
    }
}

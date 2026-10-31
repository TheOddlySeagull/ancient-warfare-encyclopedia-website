// Shared by all catalogue pages. HTTP caching handles repeat visits without
// storing the multi-megabyte catalogue in quota-limited localStorage.
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

export function loadCatalogue() {
    if (!cataloguePromise) cataloguePromise = fetch(new URL('json/structures.json', root))
        .then(response => {
            if (!response.ok) throw new Error('Unable to load the structure catalogue');
            return response.json();
        })
        .then(catalogue => {
            if (!catalogue.data || typeof catalogue.data !== 'object') throw new Error('Invalid structure catalogue');
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

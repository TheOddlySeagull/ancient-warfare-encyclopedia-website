import { summarizeAuthors } from './author-directory-data.js';

function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
}
function count(value) { return value.toLocaleString('en'); }
function structures(value) { return count(value) + (value === 1 ? ' structure' : ' structures'); }
function link(page, parameter, value, text) {
    const anchor = element('a', text);
    const url = new URL(page, location.href);
    url.searchParams.set(parameter, value);
    anchor.href = url.href;
    return anchor;
}

export function renderAuthorDirectory(catalogue) {
    const { authors, unattributed } = summarizeAuthors(catalogue);
    document.title = 'Authors — Ancient Warfare Structures Encyclopedia';
    const main = document.getElementById('authorPageMain');
    main.classList.add('author-directory');
    const intro = element('section', undefined, 'directory-intro');
    intro.append(element('p', 'THE BUILDERS BEHIND THE WORLD', 'directory-eyebrow'),
        element('h1', 'Structure authors'),
        element('p', 'Discover the builders, explore their work, and find the structure packs they have contributed to.'));
    const credited = authors.reduce((total, author) => total + author.count, 0);
    intro.append(element('p', count(authors.length) + ' authors · ' + structures(credited) + ' with named credits', 'directory-totals'));
    const controls = element('div', undefined, 'directory-controls');
    const label = element('label', 'Find an author or pack');
    const search = element('input');
    search.type = 'search'; search.placeholder = 'Author name or structure pack…';
    label.append(search);
    controls.append(label);
    const status = element('p', '', 'directory-status');
    status.setAttribute('role', 'status');
    const cards = element('div', undefined, 'directory-cards');
    const note = element('section', undefined, 'directory-unattributed');
    note.append(element('h2', 'Unattributed structures'), element('p', structures(unattributed) + ' have no named author in the catalogue. They are counted separately from the authors above.'));
    main.replaceChildren(intro, controls, status, cards, note);

    function render() {
        const term = search.value.trim().toLowerCase();
        const matches = authors.filter(author => author.name.toLowerCase().includes(term) || author.packs.some(pack => pack.name.toLowerCase().includes(term)));
        status.textContent = matches.length === authors.length ? 'All ' + count(authors.length) + ' authors · most structures first' : count(matches.length) + ' of ' + count(authors.length) + ' authors';
        const fragment = document.createDocumentFragment();
        for (const author of matches) {
            const card = element('article', undefined, 'directory-author');
            const heading = element('h2');
            heading.append(link('author.html', 'author', author.name, author.name));
            const total = element('p', structures(author.count), 'directory-count');
            const description = element('p', 'Published in ' + count(author.packs.length) + (author.packs.length === 1 ? ' pack' : ' packs'), 'directory-pack-count');
            const list = element('ul');
            for (const pack of author.packs) {
                const item = element('li');
                item.append(link('package.html', 'packName', pack.name, pack.name), element('span', structures(pack.count)));
                list.append(item);
            }
            const profile = link('author.html', 'author', author.name, 'Explore ' + author.name + '’s work →');
            profile.className = 'directory-profile';
            card.append(heading, total, description, list, profile);
            fragment.append(card);
        }
        if (!matches.length) fragment.append(element('p', 'No authors match your search. Try another author or pack name.'));
        cards.replaceChildren(fragment);
    }
    search.addEventListener('input', render);
    render();
    const aside = document.getElementById('asideGeneralMenu');
    aside.replaceChildren();
    aside.append(element('h3', 'Author directory'), element('p', count(authors.length) + ' named authors'), element('p', structures(Object.keys(catalogue).length) + ' in the catalogue'));
}

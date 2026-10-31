// Count catalogue records, keeping names shared across packs as separate structures.
export function summarizeAuthors(catalogue) {
    const authors = new Map();
    let unattributed = 0;
    for (const structure of Object.values(catalogue)) {
        const credit = structure.validation?.structureAuthor;
        const name = typeof credit === 'string' ? credit.trim() : '';
        if (!name || ['unknown', 'undefined', 'null'].includes(name.toLowerCase())) {
            unattributed++;
            continue;
        }
        if (!authors.has(name)) authors.set(name, { name, count: 0, packs: new Map() });
        const author = authors.get(name);
        author.count++;
        const pack = structure.pack || 'Unspecified pack';
        author.packs.set(pack, (author.packs.get(pack) || 0) + 1);
    }
    return {
        authors: [...authors.values()].map(author => ({
            ...author,
            packs: [...author.packs].map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
        unattributed
    };
}

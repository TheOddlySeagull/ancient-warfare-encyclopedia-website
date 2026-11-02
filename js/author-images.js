import { sitePath } from './catalogue.js';

// Directory cards and profile pages use the same existing author artwork.
export function createAuthorImage(author, { lazy = true, decorative = false } = {}) {
    const image = new Image();
    image.alt = decorative ? '' : (author ? author + ' profile icon' : 'Ancient Warfare 2');
    image.loading = lazy ? 'lazy' : 'eager';
    image.decoding = 'async';
    const fallback = sitePath('img/AW2.png');
    if (typeof author !== 'string' || !author.trim()) {
        image.src = fallback;
        return image;
    }
    image.onerror = () => {
        image.onerror = null; // A missing fallback must never trigger a request loop.
        image.src = fallback;
    };
    image.src = sitePath('img/authors/profiles/' + author + '.png');
    return image;
}

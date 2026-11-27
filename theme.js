const STORAGE_KEY = 'theme';
const root = document.documentElement;

function readTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === 'dark' || saved === 'light' ? saved : null;
    } catch(err) {
        console.warn("The theme preference could not be read");
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
        console.warn("The theme preference could not be saved.");
    }
}

function applyTheme(theme) {
    root.dataset.theme = theme;
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.textContent = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    }
}

applyTheme(readTheme() ?? 'light');

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    applyTheme(root.dataset.theme);
    btn.hidden = false;
    btn.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce').matches;
        if (!document.startViewTransition || reduceMotion) {
            applyTheme(next);
        } else {
            document.startViewTransition(() => applyTheme(next));
        }
        saveTheme(next);
    })
})
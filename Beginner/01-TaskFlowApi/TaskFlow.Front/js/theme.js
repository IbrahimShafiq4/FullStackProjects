const Theme = {
    STORAGE_KEY: 'taskflow-theme',

    getCurrentTheme() {
        return localStorage.getItem(this.STORAGE_KEY) || 'light';
    },

    applyTheme(theme) {
        const html = document.documentElement;
        const icon = document.getElementById('themeIcon');

        if (theme === 'dark') {
            html.classList.add('dark');
            icon.textContent = '☀️';
        } else {
            html.classList.remove('dark');
            icon.textContent = '🌙';
        }

        localStorage.setItem(this.STORAGE_KEY, theme);
    },

    toggle() {
        const current = this.getCurrentTheme();
        const newTheme = current === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    },

    init() {
        const theme = this.getCurrentTheme();
        this.applyTheme(theme);

        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    },
};
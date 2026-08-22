/**
 * ==========================================
 * App - التطبيق الرئيسي
 * ==========================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme
    Theme.init();

    // 2. SignalR
    // (تم بدء التشغيل في signalr.js)

    // 3. Console Welcome
    console.log('%c🎬 VideoPlatform v1.0', 'font-size: 24px; font-weight: bold; color: #3b82f6;');
    console.log('%cمنصة مشاركة الفيديوهات - صنع بـ ❤️', 'font-size: 14px; color: #6b7280;');
    console.log('%c🔗 SignalR للتواصل في الوقت الفعلي', 'font-size: 12px; color: #8b5cf6;');
    console.log('%c📹 رفع فيديو ومشاهدة في الوقت الفعلي', 'font-size: 12px; color: #8b5cf6;');

    // 4. Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + U = رفع فيديو
        if (e.altKey && e.key === 'u') {
            e.preventDefault();
            const uploadBtn = document.querySelector('a[href="upload.html"]');
            if (uploadBtn) uploadBtn.click();
        }

        // Alt + H = الصفحة الرئيسية
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = 'index.html';
        }

        // Alt + S = تركيز على البحث
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        }
    });
});
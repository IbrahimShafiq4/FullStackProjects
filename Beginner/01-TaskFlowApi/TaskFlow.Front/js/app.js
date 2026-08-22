document.addEventListener('DOMContentLoaded', () => {
    Theme.init();

    Streak.display(2);

    Tasks.display();

    Tasks.updateTotalTasks();

    const form = document.getElementById('taskForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const titleInput = document.getElementById('taskTitle');
            const userIdInput = document.getElementById('userStreakId');

            const title = titleInput.value.trim();
            const userStreakId = parseInt(userIdInput.value);

            if (!title) {
                Tasks.showToast('⚠️ الرجاء إدخال عنوان المهمة', 'error');
                titleInput.focus();
                return;
            }

            if (title.length < 3) {
                Tasks.showToast('⚠️ عنوان المهمة يجب أن يكون 3 أحرف على الأقل', 'error');
                titleInput.focus();
                return;
            }

            if (!userStreakId || userStreakId < 1) {
                Tasks.showToast('⚠️ الرجاء إدخال User ID صحيح (رقم موجب)', 'error');
                userIdInput.focus();
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';

            try {
                await Tasks.add(title, userStreakId);

                titleInput.value = '';
                userIdInput.value = '1';
                titleInput.focus();

            } catch (error) {
                console.error(error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            document.getElementById('taskTitle')?.focus();
        }
    });

    console.log('%c🚀 TaskFlow v1.0', 'font-size: 24px; font-weight: bold; color: #3b82f6;');
    console.log('%cصنع بـ ❤️ باستخدام ASP.NET Core & Tailwind CSS', 'font-size: 14px; color: #6b7280;');
    console.log('%c👨‍💻 Keyboard Shortcut: Ctrl + N لإضافة مهمة جديدة', 'font-size: 12px; color: #8b5cf6;');
});
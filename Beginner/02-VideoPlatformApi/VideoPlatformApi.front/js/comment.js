/**
 * ==========================================
 * Comment Manager - إدارة التعليقات
 * ==========================================
 */

const Comment = {
    videoId: null,
    userId: 1,

    // ===== تحميل التعليقات =====
    async load(videoId) {
        this.videoId = videoId;
        const container = document.getElementById('commentsList');
        if (!container) return;

        try {
            const comments = await Api.getComments(videoId);

            if (comments.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-8 text-gray-400 dark:text-gray-500">
                        <i class="fas fa-comment-slash text-3xl mb-3 block"></i>
                        <p>لا توجد تعليقات</p>
                        <p class="text-sm">كن أول من يعلق!</p>
                    </div>
                `;
                document.getElementById('commentCount').textContent = '0';
                return;
            }

            container.innerHTML = comments.map(comment => `
                <div class="comment-item flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        ${comment.username ? comment.username.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-gray-800 dark:text-white">
                                ${escapeHtml(comment.username || 'مجهول')}
                            </span>
                            <span class="text-xs text-gray-400 dark:text-gray-500">
                                ${formatCommentDate(comment.createdAt)}
                            </span>
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 mt-1">
                            ${escapeHtml(comment.content)}
                        </p>
                    </div>
                </div>
            `).join('');

            document.getElementById('commentCount').textContent = comments.length;

        } catch (error) {
            console.error('Error loading comments:', error);
            container.innerHTML = `
                <div class="text-center py-8 text-red-500 dark:text-red-400">
                    <i class="fas fa-exclamation-triangle text-3xl mb-3 block"></i>
                    <p>فشل في تحميل التعليقات</p>
                </div>
            `;
        }
    },

    // ===== إضافة تعليق =====
    async add() {
        const input = document.getElementById('commentInput');
        const content = input.value.trim();

        if (!content) {
            showToast('الرجاء كتابة تعليق', 'error');
            input.focus();
            return;
        }

        if (content.length < 2) {
            showToast('التعليق قصير جداً', 'error');
            input.focus();
            return;
        }

        try {
            const comment = await Api.createComment(content, this.videoId, this.userId);

            // نضيف التعليق في الواجهة
            const container = document.getElementById('commentsList');
            const noComments = container.querySelector('.text-gray-400');
            if (noComments) {
                container.innerHTML = '';
            }

            const commentHtml = `
                <div class="comment-item flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl animate-slide-up">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        ${comment.username ? comment.username.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-gray-800 dark:text-white">
                                ${escapeHtml(comment.username || 'أنت')}
                            </span>
                            <span class="text-xs text-gray-400 dark:text-gray-500">
                                الآن
                            </span>
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 mt-1">
                            ${escapeHtml(comment.content)}
                        </p>
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('afterbegin', commentHtml);

            // نحدث العدد
            const countEl = document.getElementById('commentCount');
            const currentCount = parseInt(countEl.textContent) || 0;
            countEl.textContent = currentCount + 1;

            // نفضي الـ Input
            input.value = '';
            showToast('تم إضافة التعليق', 'success');

        } catch (error) {
            console.error('Error adding comment:', error);
            showToast(error.message, 'error');
        }
    },

    // ===== إضافة تعليق في الوقت الفعلي (من SignalR) =====
    addCommentRealtime(data) {
        const container = document.getElementById('commentsList');
        if (!container) return;

        // نشيل رسالة "لا توجد تعليقات"
        const noComments = container.querySelector('.text-gray-400');
        if (noComments) {
            container.innerHTML = '';
        }

        const commentHtml = `
            <div class="comment-item flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl animate-slide-up">
                <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    ${data.username ? data.username.charAt(0).toUpperCase() : '?'}
                </div>
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-gray-800 dark:text-white">
                            ${escapeHtml(data.username || 'مجهول')}
                        </span>
                        <span class="text-xs text-green-600 dark:text-green-400">
                            <i class="fas fa-circle text-[6px] ml-1"></i>
                            جديد
                        </span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 mt-1">
                        ${escapeHtml(data.comment)}
                    </p>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('afterbegin', commentHtml);

        // نحدث العدد
        const countEl = document.getElementById('commentCount');
        const currentCount = parseInt(countEl.textContent) || 0;
        countEl.textContent = currentCount + 1;

        // إشعار
        SignalR.showNotification(`💬 تعليق جديد من ${data.username}`, 'info');
    },
};

// ===== Helper =====
function formatCommentDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);

    if (diff < 60) return 'الآن';
    if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
    if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
    if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
    return d.toLocaleDateString('ar-EG');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type) {
    // نستخدم الـ Toast من video-detail.js
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    }
}

// ===== ربط الـ Enter =====
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('commentInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                Comment.add();
            }
        });
    }
});
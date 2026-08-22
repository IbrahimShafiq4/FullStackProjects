/**
 * ==========================================
 * Like Manager - إدارة الإعجابات
 * ==========================================
 */

const Like = {
    videoId: null,
    userId: 1,
    liked: false,
    count: 0,

    // ===== تحميل حالة الإعجاب =====
    async loadStatus(videoId, userId) {
        this.videoId = videoId;
        this.userId = userId || 1;

        try {
            const status = await Api.getLikeStatus(videoId, this.userId);
            this.liked = status.userLiked || false;
            this.count = status.likes || 0;
            this.updateUI();
        } catch (error) {
            console.error('Error loading like status:', error);
        }
    },

    // ===== تبديل الإعجاب =====
    async toggle() {
        if (!this.videoId) return;

        const btn = document.getElementById('likeBtn');
        const icon = document.getElementById('likeIcon');

        // نضيف Loading State
        btn.disabled = true;
        btn.classList.add('opacity-50');

        try {
            const result = await Api.toggleLike(this.videoId, this.userId);
            this.liked = result.userLiked;
            this.count = result.likes;
            this.updateUI();

            // Animation
            icon.classList.add('like-animation');
            setTimeout(() => icon.classList.remove('like-animation'), 400);

        } catch (error) {
            console.error('Error toggling like:', error);
            showToast(error.message, 'error');
        }

        btn.disabled = false;
        btn.classList.remove('opacity-50');
    },

    // ===== تحديث الواجهة =====
    updateUI() {
        const icon = document.getElementById('likeIcon');
        const count = document.getElementById('likeCount');

        if (this.liked) {
            icon.className = 'fas fa-heart text-red-500 text-xl';
        } else {
            icon.className = 'far fa-heart text-xl';
        }

        count.textContent = this.count || 0;
    },

    // ===== تحديث من SignalR =====
    updateLikeCount(videoId, likes, userLiked) {
        if (videoId !== this.videoId) return;

        this.count = likes;
        if (userLiked !== undefined) {
            this.liked = userLiked;
        }
        this.updateUI();
    },
};

// ===== Helpers =====
function showToast(message, type) {
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    }
}
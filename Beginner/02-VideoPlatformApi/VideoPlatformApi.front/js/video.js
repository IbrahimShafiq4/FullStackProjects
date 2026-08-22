/**
 * ==========================================
 * Video Manager - إدارة الفيديوهات
 * ==========================================
 */
const API_URL = "http://localhost:5115";
const Video = {
    videos: [],
    filteredVideos: [],
    currentPage: 0,
    pageSize: 12,
    currentFilter: 'all',
    isLoading: false,
    hasMore: true,

    // ===== تحميل الفيديوهات =====
    async load() {
        this.isLoading = true;
        this.showSkeleton();

        try {
            const videos = await Api.getVideos();
            this.videos = videos;
            this.filteredVideos = [...videos];
            this.hasMore = this.filteredVideos.length > this.pageSize;
            this.render();
            this.updateStats(videos);
        } catch (error) {
            console.error('Error loading videos:', error);
            this.showError(error.message);
        }

        this.isLoading = false;
    },

    // ===== عرض الفيديوهات =====
    render() {
        const grid = document.getElementById('videoGrid');
        if (!grid) return;

        const start = 0;
        const end = (this.currentPage + 1) * this.pageSize;
        const pageVideos = this.filteredVideos.slice(start, end);

        if (pageVideos.length === 0 && this.currentPage === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12 text-gray-400 dark:text-gray-500 animate-fade-in">
                    <i class="fas fa-video-slash text-5xl mb-4 block opacity-50"></i>
                    <p class="text-lg font-medium">مفيش فيديوهات حالياً</p>
                    <p class="text-sm">كن أول من يرفع فيديو!</p>
                    <a href="upload.html" class="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                        <i class="fas fa-upload ml-2"></i>
                        رفع فيديو
                    </a>
                </div>
            `;
            document.getElementById('loadMoreBtn')?.classList.add('hidden');
            return;
        }

        grid.innerHTML = pageVideos.map((video, index) => `
            <div class="video-card bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 animate-fade-in"
                 style="animation-delay: ${index * 50}ms"
                        onclick="window.location.href='video-detail.html?id=${video.id}'">
                <div class="thumbnail relative">
                    <img
                        src="${API_URL}${video.thumbnailUrl}"
                        alt="${this.escapeHtml(video.title)}"
                        class="w-full h-48 object-cover"
                        onerror="this.src='${API_URL}/thumbnails/default-thumbnail.jpg'"
                    />
                    <span class="duration">${this.formatDuration()}</span>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 dark:text-white line-clamp-2 mb-2">
                        ${this.escapeHtml(video.title)}
                    </h3>
                    <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>
                            <i class="fas fa-user ml-1"></i>
                            ${this.escapeHtml(video.username || 'مجهول')}
                        </span>
                        <span>
                            <i class="fas fa-eye ml-1"></i>
                            ${this.formatNumber(video.views || 0)}
                        </span>
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                            ${this.escapeHtml(video.category || 'عام')}
                        </span>
                        <span class="text-xs text-gray-400 dark:text-gray-500">
                            ${this.formatDate(video.uploadedAt)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // زر تحميل المزيد
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            if (this.filteredVideos.length > (this.currentPage + 1) * this.pageSize) {
                loadMoreBtn.classList.remove('hidden');
            } else {
                loadMoreBtn.classList.add('hidden');
            }
        }
    },

    // ===== تحميل المزيد =====
    loadMore() {
        if (this.isLoading) return;
        this.currentPage++;
        this.render();
    },

    // ===== فلترة =====
    async filter(category) {
        this.currentFilter = category;
        this.currentPage = 0;

        // نحدث الـ Buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });

        this.showSkeleton();

        try {
            let videos;
            if (category === 'all') {
                videos = await Api.getVideos();
            } else {
                videos = await Api.getVideosByCategory(category);
            }
            this.filteredVideos = videos;
            this.hasMore = this.filteredVideos.length > this.pageSize;
            this.render();
        } catch (error) {
            console.error('Error filtering videos:', error);
            this.showError(error.message);
        }
    },

    // ===== بحث =====
    async search(query) {
        if (!query || query.trim() === '') {
            this.filter(this.currentFilter);
            return;
        }

        this.currentPage = 0;
        this.showSkeleton();

        try {
            const videos = await Api.searchVideos(query);
            this.filteredVideos = videos;
            this.hasMore = this.filteredVideos.length > this.pageSize;
            this.render();
        } catch (error) {
            console.error('Error searching:', error);
            this.showError(error.message);
        }
    },

    // ===== تحديث الصفحة =====
    refresh() {
        this.currentPage = 0;
        this.load();
    },

    // ===== تحديث المشاهدات (من SignalR) =====
    updateViews(videoId, views) {
        const viewEl = document.querySelector(`[data-video-id="${videoId}"] .views-count`);
        if (viewEl) {
            viewEl.textContent = this.formatNumber(views);
        }
    },

    // ===== تحديث الإحصائيات =====
    updateStats(videos) {
        const totalEl = document.getElementById('totalVideos');
        const viewsEl = document.getElementById('totalViews');
        const likesEl = document.getElementById('totalLikes');
        const usersEl = document.getElementById('totalUsers');

        if (totalEl) totalEl.textContent = videos.length;

        let totalViews = 0;
        let totalLikes = 0;
        videos.forEach(v => {
            totalViews += v.views || 0;
            totalLikes += v.likeCount || 0;
        });

        if (viewsEl) viewsEl.textContent = this.formatNumber(totalViews);
        if (likesEl) likesEl.textContent = this.formatNumber(totalLikes);

        // نجيب عدد المستخدمين
        Api.getUsers()
            .then(users => {
                if (usersEl) usersEl.textContent = users.length;
            })
            .catch(() => {
                if (usersEl) usersEl.textContent = '?';
            });
    },

    // ===== UI Helpers =====

    showSkeleton() {
        const grid = document.getElementById('videoGrid');
        if (!grid) return;
        grid.innerHTML = Array(6).fill(0).map(() => `
            <div class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div class="skeleton h-48"></div>
                <div class="p-4 space-y-3">
                    <div class="skeleton h-5 w-3/4"></div>
                    <div class="skeleton h-4 w-1/2"></div>
                    <div class="skeleton h-4 w-1/3"></div>
                </div>
            </div>
        `).join('');
    },

    showError(message) {
        const grid = document.getElementById('videoGrid');
        if (!grid) return;
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 text-red-500 dark:text-red-400 animate-fade-in">
                <i class="fas fa-exclamation-triangle text-5xl mb-4 block"></i>
                <p class="text-lg font-medium">حدث خطأ في تحميل الفيديوهات</p>
                <p class="text-sm">${this.escapeHtml(message)}</p>
                <button onclick="Video.refresh()"
                        class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors">
                    <i class="fas fa-redo ml-2"></i>
                    إعادة المحاولة
                </button>
            </div>
        `;
    },

    // ===== Helpers =====

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    },

    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now - d) / 1000);

        if (diff < 60) return 'منذ لحظات';
        if (diff < 3600) return `منذ ${Math.floor(diff / 60)} دقيقة`;
        if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} ساعة`;
        if (diff < 604800) return `منذ ${Math.floor(diff / 86400)} يوم`;
        return d.toLocaleDateString('ar-EG');
    },

    formatDuration() {
        // مؤقت
        return '10:30';
    },

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
};

// ===== Event Listeners =====

document.addEventListener('DOMContentLoaded', () => {
    // تحميل الفيديوهات
    Video.load();

    // بحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                Video.search(searchInput.value);
            }, 300);
        });
    }
});
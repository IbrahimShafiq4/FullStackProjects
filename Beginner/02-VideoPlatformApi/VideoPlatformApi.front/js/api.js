/**
 * ==========================================
 * API Service - التعامل مع الـ Backend
 * ==========================================
 */

const API_BASE_URL = 'http://localhost:5115/api';

// ===== دوال الـ API =====

const Api = {
    // ===== Videos =====
    async getVideos() {
        const response = await fetch(`${API_BASE_URL}/Videos`);
        if (!response.ok) throw new Error('فشل في جلب الفيديوهات');
        const result = await response.json();
        return result.data || [];
    },

    async getVideo(id) {
        const response = await fetch(`${API_BASE_URL}/Videos/${id}`);
        if (!response.ok) throw new Error('فشل في جلب الفيديو');
        const result = await response.json();
        return result.data;
    },

    async getVideosByCategory(category) {
        const response = await fetch(`${API_BASE_URL}/Videos/category/${category}`);
        if (!response.ok) throw new Error('فشل في جلب الفيديوهات');
        const result = await response.json();
        return result.data || [];
    },

    async searchVideos(query) {
        const response = await fetch(`${API_BASE_URL}/Videos/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('فشل في البحث');
        const result = await response.json();
        return result.data || [];
    },

    async getMostViewed(count = 10) {
        const response = await fetch(`${API_BASE_URL}/Videos/most-viewed?count=${count}`);
        if (!response.ok) throw new Error('فشل في جلب الفيديوهات');
        const result = await response.json();
        return result.data || [];
    },

    async getRecent(count = 10) {
        const response = await fetch(`${API_BASE_URL}/Videos/recent?count=${count}`);
        if (!response.ok) throw new Error('فشل في جلب الفيديوهات');
        const result = await response.json();
        return result.data || [];
    },

    async createVideo(formData) {
        const response = await fetch(`${API_BASE_URL}/Videos`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'فشل في رفع الفيديو');
        }
        const result = await response.json();
        return result.data;
    },

    async incrementViews(id) {
        const response = await fetch(`${API_BASE_URL}/Videos/${id}/view`, {
            method: 'PATCH',
        });
        if (!response.ok) throw new Error('فشل في تحديث المشاهدات');
        const result = await response.json();
        return result;
    },

    // ===== Likes =====
    async toggleLike(videoId, userId) {
        const response = await fetch(`${API_BASE_URL}/Videos/${videoId}/like?userId=${userId}`, {
            method: 'POST',
        });
        if (!response.ok) throw new Error('فشل في تغيير الإعجاب');
        const result = await response.json();
        return result;
    },

    async getLikeStatus(videoId, userId) {
        const response = await fetch(`${API_BASE_URL}/Videos/${videoId}/like-status?userId=${userId}`);
        if (!response.ok) throw new Error('فشل في جلب حالة الإعجاب');
        const result = await response.json();
        return result;
    },

    // ===== Comments =====
    async getComments(videoId) {
        const response = await fetch(`${API_BASE_URL}/Comments/video/${videoId}`);
        if (!response.ok) throw new Error('فشل في جلب التعليقات');
        const result = await response.json();
        return result.data || [];
    },

    async createComment(content, videoId, userId) {
        const response = await fetch(`${API_BASE_URL}/Comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content,
                videoId,
                userId,
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'فشل في إضافة التعليق');
        }
        const result = await response.json();
        return result.data;
    },

    // ===== Users =====
    async getUsers() {
        const response = await fetch(`${API_BASE_URL}/Users`);
        if (!response.ok) throw new Error('فشل في جلب المستخدمين');
        const result = await response.json();
        return result.data || [];
    },

    async getUser(id) {
        const response = await fetch(`${API_BASE_URL}/Users/${id}`);
        if (!response.ok) throw new Error('فشل في جلب المستخدم');
        const result = await response.json();
        return result.data;
    },

    async createUser(formData) {
        const response = await fetch(`${API_BASE_URL}/Users`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'فشل في إنشاء المستخدم');
        }
        const result = await response.json();
        return result.data;
    },
};
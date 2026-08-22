/**
 * ==========================================
 * SignalR Client - الاتصال في الوقت الفعلي
 * ==========================================
 */

const SignalR = {
    connection: null,
    isConnected: false,

    // ===== بدء الاتصال =====
    async start() {
        try {
            // ننشئ الاتصال
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5115/videoHub')
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // ===== أحداث =====

            // عند الاتصال
            this.connection.on('Connected', (message) => {
                console.log('✅ SignalR:', message);
                this.isConnected = true;
                this.updateStatus(true);
            });

            // عند قطع الاتصال
            this.connection.on('Disconnected', (message) => {
                console.log('❌ SignalR:', message);
                this.isConnected = false;
                this.updateStatus(false);
            });

            // ===== إشعارات =====

            // فيديو جديد
            this.connection.on('NewVideoUploaded', (data) => {
                console.log('📹 فيديو جديد:', data);
                this.showNotification(`📹 فيديو جديد: ${data.title}`, 'info');
                // نحدث الصفحة
                if (typeof Video !== 'undefined') {
                    Video.refresh();
                }
            });

            // تحديث المشاهدات
            this.connection.on('ViewsUpdated', (data) => {
                console.log('👁️ تحديث المشاهدات:', data);
                // نحدث عدد المشاهدات في الصفحة
                if (typeof Video !== 'undefined') {
                    Video.updateViews(data.videoId, data.views);
                }
                if (typeof window.updateViewCount === 'function') {
                    window.updateViewCount(data.views);
                }
            });

            // تعليق جديد
            this.connection.on('NewComment', (data) => {
                console.log('💬 تعليق جديد:', data);
                this.showNotification(`💬 تعليق جديد من ${data.username}`, 'info');
                // نضيف التعليق في الوقت الفعلي
                if (typeof Comment !== 'undefined') {
                    Comment.addCommentRealtime(data);
                }
            });

            // تحديث الإعجابات
            this.connection.on('LikesUpdated', (data) => {
                console.log('❤️ تحديث الإعجابات:', data);
                if (typeof Like !== 'undefined') {
                    Like.updateLikeCount(data.videoId, data.likes, data.userLiked);
                }
            });

            // ===== نبدأ الاتصال =====
            await this.connection.start();
            console.log('✅ SignalR connected');

            // ننضم لمجموعة فيديو معين (لو في صفحة التفاصيل)
            const videoId = this.getVideoIdFromUrl();
            if (videoId) {
                await this.joinVideoGroup(videoId);
            }

            return true;

        } catch (error) {
            console.error('❌ SignalR connection failed:', error);
            this.updateStatus(false);
            return false;
        }
    },

    // ===== الانضمام لمجموعة فيديو =====
    async joinVideoGroup(videoId) {
        if (!this.isConnected || !this.connection) return;
        try {
            await this.connection.invoke('JoinVideoGroup', videoId);
            console.log(`✅ Joined video group: ${videoId}`);
        } catch (error) {
            console.error('❌ Failed to join group:', error);
        }
    },

    // ===== مغادرة مجموعة فيديو =====
    async leaveVideoGroup(videoId) {
        if (!this.isConnected || !this.connection) return;
        try {
            await this.connection.invoke('LeaveVideoGroup', videoId);
            console.log(`✅ Left video group: ${videoId}`);
        } catch (error) {
            console.error('❌ Failed to leave group:', error);
        }
    },

    // ===== إشعارات =====

    // إشعار بفيديو جديد
    async notifyNewVideo(title, username) {
        if (!this.isConnected || !this.connection) return;
        try {
            await this.connection.invoke('NotifyNewVideo', title, username);
        } catch (error) {
            console.error('❌ Failed to notify:', error);
        }
    },

    // تحديث المشاهدات
    async notifyViews(videoId, views) {
        if (!this.isConnected || !this.connection) return;
        try {
            await this.connection.invoke('UpdateViews', videoId, views);
        } catch (error) {
            console.error('❌ Failed to notify views:', error);
        }
    },

    // إشعار بتعليق جديد
    async notifyComment(videoId, username, comment) {
        if (!this.isConnected || !this.connection) return;
        try {
            await this.connection.invoke('NotifyNewComment', videoId, username, comment);
        } catch (error) {
            console.error('❌ Failed to notify comment:', error);
        }
    },

    // ===== Helper =====

    getVideoIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id')) || null;
    },

    // ===== UI =====

    updateStatus(connected) {
        const el = document.getElementById('connectionStatus');
        if (!el) return;
        if (connected) {
            el.className = 'fixed bottom-4 right-4 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold shadow-lg z-50';
            el.innerHTML = '<i class="fas fa-circle text-green-300 ml-2"></i> متصل';
        } else {
            el.className = 'fixed bottom-4 right-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold shadow-lg z-50';
            el.innerHTML = '<i class="fas fa-circle text-red-300 ml-2"></i> غير متصل';
        }
        el.classList.remove('hidden');
    },

    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const msgEl = document.getElementById('notificationMessage');
        if (!toast || !msgEl) return;

        msgEl.textContent = message;

        // نحدد اللون
        const colors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            info: 'bg-blue-600',
        };
        toast.className = `fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl text-white font-semibold shadow-2xl z-50 ${colors[type] || colors.info}`;
        toast.classList.remove('hidden', 'opacity-0', '-translate-y-4');
        toast.classList.add('notification-toast');

        // نختفي بعد 4 ثواني
        clearTimeout(this._toastTimeout);
        this._toastTimeout = setTimeout(() => {
            toast.classList.add('opacity-0', '-translate-y-4');
            setTimeout(() => toast.classList.add('hidden'), 500);
        }, 4000);
    },
};

// ===== نبدأ الاتصال تلقائياً =====
document.addEventListener('DOMContentLoaded', () => {
    SignalR.start();
});
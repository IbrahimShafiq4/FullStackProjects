const API_URL = "https://localhost:7175/";
let currentVideo = null;
let currentVideoId = null;
let currentUserId = 1;

async function loadVideo() {
    const params = new URLSearchParams(window.location.search);
    currentVideoId = parseInt(params.get('id'));

    if (!currentVideoId) {
        showToast('معرف الفيديو غير موجود', 'error');
        return;
    }

    try {
        const video = await Api.getVideo(currentVideoId);
        currentVideo = video;
        displayVideo(video);

        await SignalR.joinVideoGroup(currentVideoId);

        await Comment.load(currentVideoId);

        await Like.loadStatus(currentVideoId, currentUserId);

        await Api.incrementViews(currentVideoId);

        document.getElementById('viewCount').textContent = video.views || 0;
        document.getElementById('detailViewCount').textContent = video.views || 0;

    } catch (error) {
        console.error('Error loading video:', error);
        showToast(error.message, 'error');
    }
}

function displayVideo(video) {
    document.getElementById('videoTitle').textContent = video.title;

    document.getElementById('videoDescription').textContent = video.description || 'لا يوجد وصف';

    const videoSource = document.getElementById('videoSource');
    videoSource.src = `${API_URL}${video.videoUrl}`;
    document.getElementById('videoPlayer').load();

    document.getElementById('videoCategory').textContent = video.category || 'عام';

    const username = video.username || 'مجهول';
    document.getElementById('videoUsername').textContent = username;
    document.getElementById('userInitial').textContent = username.charAt(0).toUpperCase();

    document.getElementById('videoDate').textContent = formatDate(video.uploadedAt);

    document.getElementById('viewCount').textContent = video.views || 0;
    document.getElementById('detailViewCount').textContent = video.views || 0;

    document.getElementById('likeCount').textContent = video.likeCount || 0;

    document.getElementById('commentCount').textContent = video.commentCount || 0;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;

    msgEl.textContent = message;

    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    };

    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl text-white font-semibold shadow-2xl z-50 ${colors[type] || colors.info}`;
    toast.classList.remove('hidden', 'opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => toast.classList.add('hidden'), 500);
    }, 3000);
}

function shareVideo() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({
            title: currentVideo?.title || 'فيديو',
            url: url,
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(url).then(() => {
            showToast('تم نسخ الرابط', 'success');
        }).catch(() => {
            showToast('فشل في نسخ الرابط', 'error');
        });
    }
}

window.updateViewCount = function(views) {
    document.getElementById('viewCount').textContent = views;
    document.getElementById('detailViewCount').textContent = views;
};

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

document.addEventListener('DOMContentLoaded', loadVideo);
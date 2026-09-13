document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const videoInput = document.getElementById('videoFileInput');
    const thumbnailInput = document.getElementById('thumbnailInput');
    const videoNameEl = document.getElementById('videoFileName');
    const thumbnailNameEl = document.getElementById('thumbnailFileName');
    const progressDiv = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const resultDiv = document.getElementById('uploadResult');

    videoInput.addEventListener('change', () => {
        if (videoInput.files.length > 0) {
            const file = videoInput.files[0];
            videoNameEl.textContent = `📹 ${file.name} (${formatFileSize(file.size)})`;
            videoNameEl.className = 'text-sm text-green-600 dark:text-green-400 mt-2';
        }
    });

    thumbnailInput.addEventListener('change', () => {
        if (thumbnailInput.files.length > 0) {
            const file = thumbnailInput.files[0];
            thumbnailNameEl.textContent = `🖼️ ${file.name} (${formatFileSize(file.size)})`;
            thumbnailNameEl.className = 'text-sm text-green-600 dark:text-green-400 mt-2';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('uploadTitle').value.trim();
        const userId = parseInt(document.getElementById('uploadUserId').value);
        const videoFile = videoInput.files[0];

        if (!title) {
            showUploadResult('الرجاء إدخال عنوان الفيديو', 'error');
            return;
        }

        if (title.length < 3) {
            showUploadResult('العنوان يجب أن يكون 3 أحرف على الأقل', 'error');
            return;
        }

        if (!videoFile) {
            showUploadResult('الرجاء اختيار فيديو', 'error');
            return;
        }

        if (!userId || userId < 1) {
            showUploadResult('معرف المستخدم غير صحيح', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Description', document.getElementById('uploadDescription').value.trim());
        formData.append('Category', document.getElementById('uploadCategory').value);
        formData.append('UserId', userId);
        formData.append('VideoFile', videoFile);

        const thumbnailFile = thumbnailInput.files[0];
        if (thumbnailFile) {
            formData.append('ThumbnailFile', thumbnailFile);
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';

        progressDiv.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        resultDiv.className = 'mt-4 hidden';

        try {
            const xhr = new XMLHttpRequest();

            const uploadPromise = new Promise((resolve, reject) => {
                xhr.open('POST', `${API_BASE_URL}/Videos`);
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        progressBar.style.width = `${percent}%`;
                        progressText.textContent = `${percent}%`;
                    }
                });

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const result = JSON.parse(xhr.responseText);
                            resolve(result);
                        } catch {
                            resolve(xhr.responseText);
                        }
                    } else {
                        try {
                            const error = JSON.parse(xhr.responseText);
                            reject(new Error(error.message || 'فشل في الرفع'));
                        } catch {
                            reject(new Error(`خطأ ${xhr.status}`));
                        }
                    }
                };

                xhr.onerror = () => {
                    reject(new Error('فشل الاتصال بالسيرفر'));
                };

                xhr.send(formData);
            });

            const result = await uploadPromise;

            progressBar.style.width = '100%';
            progressText.textContent = '100%';

            showUploadResult('✅ تم رفع الفيديو بنجاح!', 'success');

            await SignalR.notifyNewVideo(title, 'مستخدم');

            setTimeout(() => {
                form.reset();
                videoNameEl.textContent = '';
                thumbnailNameEl.textContent = '';
                videoNameEl.className = 'text-sm text-blue-600 dark:text-blue-400 mt-2';
                thumbnailNameEl.className = 'text-sm text-blue-600 dark:text-blue-400 mt-2';
                progressDiv.classList.add('hidden');
                progressBar.style.width = '0%';
                progressText.textContent = '0%';

                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            showUploadResult(`❌ ${error.message || 'فشل في رفع الفيديو'}`, 'error');
            progressBar.style.width = '0%';
            progressText.textContent = '0%';
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });

    function showUploadResult(message, type = 'info') {
        resultDiv.className = `mt-4 p-4 rounded-xl ${type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : type === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`;
        resultDiv.classList.remove('hidden');
        resultDiv.textContent = message;
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
        return (bytes / 1073741824).toFixed(1) + ' GB';
    }
});
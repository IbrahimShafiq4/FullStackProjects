const Tasks = {
    async display() {
        const container = document.getElementById('tasksList');
        const countEl = document.getElementById('tasksCount');

        container.innerHTML = `
            <div class="space-y-3">
                ${Array(3).fill(0).map(() => `
                    <div class="p-4 rounded-xl skeleton h-16"></div>
                `).join('')}
            </div>
        `;

        try {
            const tasks = await Api.getTasks();

            if (!tasks || tasks.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 text-gray-400 dark:text-gray-500 animate-fade-in">
                        <i class="fas fa-inbox text-5xl mb-4 block opacity-50"></i>
                        <p class="text-lg font-medium">مفيش مهام حالياً</p>
                        <p class="text-sm">أضف أول مهمة لتبدأ رحلتك!</p>
                    </div>
                `;
                countEl.textContent = '0 مهام';
                return;
            }

            container.innerHTML = tasks.map((task, index) => `
                <div class="task-item p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 flex items-center justify-between gap-3 animate-slide-up"
                     style="animation-delay: ${index * 50}ms">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                        <input type="checkbox"
                                class="task-checkbox"
                                ${task.isCompleted ? 'checked disabled' : ''}
                                onchange="Tasks.complete(${task.id})"
                                ${task.isCompleted ? 'disabled' : ''} />
                        <div class="flex-1 min-w-0">
                            <p class="${task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-white'} font-medium truncate">
                                ${this.escapeHtml(task.title)}
                            </p>
                            <p class="text-xs text-gray-400 dark:text-gray-500">
                                <i class="far fa-calendar-alt ml-1"></i>
                                ${new Date(task.createdAt).toLocaleDateString('ar-EG', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        ${task.isCompleted ? `
                            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                                <i class="fas fa-check-circle"></i>
                                مكتملة
                            </span>
                        ` : `
                            <button onclick="Tasks.complete(${task.id})"
                                    class="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm font-bold rounded-lg transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-105 active:scale-95 flex items-center gap-2">
                                <i class="fas fa-check"></i>
                                أنجزت
                            </button>
                        `}
                        <span class="text-xs text-gray-400 dark:text-gray-500 font-mono">
                            #${task.id}
                        </span>
                    </div>
                </div>
            `).join('');

            countEl.textContent = `${tasks.length} مهام`;

        } catch (error) {
            console.error('Error loading tasks:', error);
            container.innerHTML = `
                <div class="text-center py-12 text-red-500 dark:text-red-400 animate-fade-in">
                    <i class="fas fa-exclamation-triangle text-5xl mb-4 block"></i>
                    <p class="text-lg font-medium">حدث خطأ في تحميل المهام</p>
                    <p class="text-sm">${error.message}</p>
                    <button onclick="Tasks.display()"
                            class="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <i class="fas fa-redo ml-2"></i>
                        إعادة المحاولة
                    </button>
                </div>
            `;
        }
    },

    async add(title, userStreakId) {
        try {
            const newTask = await Api.createTask(title, userStreakId);
            this.showToast('✅ تم إضافة المهمة بنجاح!', 'success');
            await this.display();
            await Streak.refresh(userStreakId);
            this.updateTotalTasks();

        } catch (error) {
            console.error('Error adding task:', error);
            this.showToast(`❌ ${error.message}`, 'error');
            throw error;
        }
    },

    async complete(taskId) {
        const buttons = document.querySelectorAll(`button[onclick="Tasks.complete(${taskId})"]`);
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';
        });

        try {
            await Api.completeTask(taskId);

            this.showToast('🎉 أحسنت! تم إنجاز المهمة!', 'success');

            await this.display();

            await Streak.refresh(1);

            this.updateTotalTasks();

        } catch (error) {
            console.error('Error completing task:', error);
            this.showToast(`❌ ${error.message}`, 'error');
            throw error;
        } finally {
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-check"></i> أنجزت';
            });
        }
    },

    async updateTotalTasks() {
        try {
            const tasks = await Api.getTasks();
            const totalEl = document.getElementById('totalTasks');
            if (totalEl) {
                totalEl.textContent = tasks.length || 0;
            }
        } catch (error) {
            console.error('Error updating total tasks:', error);
        }
    },

    showToast(message, type = 'info') {
        const oldToast = document.querySelector('.toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
};
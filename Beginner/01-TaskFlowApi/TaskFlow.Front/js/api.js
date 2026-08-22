const API_BASE_URL = 'https://localhost:7165/api';

const Api = {
    async getTasks() {
        const response = await fetch(`${API_BASE_URL}/TaskItems`);
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`فشل في جلب المهام: ${error}`);
        }
        return response.json();
    },

    async getStreak(userStreakId) {
        const response = await fetch(`${API_BASE_URL}/UserStreaks/${userStreakId}`);
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`فشل في جلب الـ Streak: ${error}`);
        }
        return response.json();
    },

    async createTask(title, userStreakId) {
        const response = await fetch(`${API_BASE_URL}/TaskItems`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title.trim(),
                userStreakId: userStreakId,
            }),
        });

        if (!response.ok) {
            let errorMessage = 'فشل في إنشاء المهمة';
            try {
                const error = await response.json();
                if (error.title) errorMessage = error.title;
                else if (error.errors) {
                    const errors = Object.values(error.errors).flat();
                    errorMessage = errors.join(', ');
                }
            } catch (e) {
                
            }
            throw new Error(errorMessage);
        }

        return response.json();
    },

    async completeTask(taskId) {
        const response = await fetch(`${API_BASE_URL}/TaskItems/${taskId}/complete`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            let errorMessage = 'فشل في تكملة المهمة';
            try {
                const error = await response.json();
                if (error.title) errorMessage = error.title;
            } catch (e) {
                
            }
            throw new Error(errorMessage);
        }

        return response;
    },
};
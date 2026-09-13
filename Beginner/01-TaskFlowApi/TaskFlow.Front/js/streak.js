const Streak = {
    async display(userStreakId) {
        const currentEl = document.getElementById('currentStreak');
        const longestEl = document.getElementById('longestStreak');

        currentEl.textContent = '...';
        longestEl.textContent = '...';

        try {
            const streak = await Api.getStreak(userStreakId);

            currentEl.classList.add('animate-bounce-in');
            longestEl.classList.add('animate-bounce-in');

            currentEl.textContent = streak.currentStreak || 0;
            longestEl.textContent = streak.longestStreak || 0;

            setTimeout(() => {
                currentEl.classList.remove('animate-bounce-in');
                longestEl.classList.remove('animate-bounce-in');
            }, 600);

        } catch (error) {
            console.error('Error loading streak:', error);
            currentEl.textContent = '❌';
            longestEl.textContent = '❌';
        }
    },
    async refresh(userStreakId) {
        await this.display(userStreakId);
    },
};
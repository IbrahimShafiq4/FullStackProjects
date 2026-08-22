/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            colors: {
                brand: '#2563EB', // أزرق ثقة/احترافية - مناسب لمنصة شغل
            },
        },
    },
    plugins: [],
};
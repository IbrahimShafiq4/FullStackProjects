module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            backgroundImage: {
                'forge-primary': 'linear-gradient(135deg, #7C3AED 0%, #4338CA 100%)',
                'forge-danger': 'linear-gradient(135deg, #F97316 0%, #DC2626 100%)',
                'forge-success': 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            },
        },
    },
    plugins: [],
};
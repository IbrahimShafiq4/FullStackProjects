module.exports = {
    darkMode: 'class',
    content: ["./src/**/*.{html,ts}"],
    theme: {
        extend: {
            backgroundImage: {
                'ledger-primary': 'linear-gradient(135deg, #059669 0%, #0D9488 100%)',
                'ledger-danger': 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                'ledger-bg': 'linear-gradient(180deg, #F0FDF4 0%, #ECFDF5 100%)',
            },
        },
    },
    plugins: [],
};
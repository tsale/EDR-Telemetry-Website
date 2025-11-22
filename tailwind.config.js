/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'charter': ['Charter', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#000000',
                secondary: '#ffffff',
                accent: '#8B8B8B',
                'light-gray': '#F5F5F5',
            },
            fontFamily: {
                sans: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
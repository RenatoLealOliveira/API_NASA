/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563eb', // Blue-600
                secondary: '#475569', // Slate-600
            },
            fontFamily: {
                sans: ['"Inter"', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                premium: {
                    gold: '#D4AF37',
                    lightGold: '#F1E5AC',
                    darkGold: '#996515',
                    charcoal: '#36454F',
                    offWhite: '#FAF9F6',
                    richBlack: '#010B13',
                }
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
                playfair: ['Playfair Display', 'serif'],
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #996515 100%)',
            }
        },
    },
    plugins: [],
}

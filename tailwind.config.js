// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');
const customColors = require('./buildchain/tailwindcss/modules/colors');

module.exports = {
    content: [
        './templates/**/*.{html,twig,html.twig}',
        './src/js/**/*.{js,jsx,ts,tsx}'
    ],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                brand: customColors.brand,
                social: customColors.social,
            },
            lineHeight: {
                loosish: '1.9',
                tighter: '1.15',
                story: '1.6',
            },
            maxWidth: {
                '1/3': '33.33333%',
                '1/4': '25%',
                '1/2': '50%',
                '3/4': '75%',
                '4/5': '80%',
            },
        },
        fontFamily: {
            sans: [
                'Roboto',
                'Helvetica Neue',
                'Helvetica',
                'Arial',
                'sans-serif',
            ],
        },
        fontSize: {
            'xxs': '.625rem', // 10px
            'xs': '.813rem', // 13px
            'sm': '.875rem', // 14px
            'slight': '.938rem', // 15px
            'base': '1.063rem', // 17px
            'lg': '1.125rem', // 18px
            'xl': '1.188rem', // 19px
            '2xl': '1.375rem', // 22px
            '2.5xl': '1.625rem', // 26px
            '3xl': '2rem', // 32px
            '4xl': '2.5rem', // 36px
            '5xl': '3rem', // 48px
            '6xl': '4rem', // 64px
            '7xl': '5rem', // 80px
        },
        zIndex: {
            '-1': '-1',
            '0': 0,
            '1': 1,
            '2': 2,
            '3': 3,
            '4': 4,
            '5': 5,
            '6': 6,
            '7': 7,
            '8': 8,
            '9': 9,
            '10': 10,
            '20': 20,
            '30': 30,
            '40': 40,
            '50': 50,
            '60': 60,
            '70': 70,
            '80': 80,
            '90': 90,
            '100': 100,
            'auto': 'auto'
        },
    },
    corePlugins: {
        container: false,
    },
    plugins: [],
};

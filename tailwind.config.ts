import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import daisyui from "daisyui"


export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				orelega: ['Orelega One'],
			},
			fontSize: {
				'custom': '3.375rem', // Taille personnalisée en rem (équivalent à 38px si base 16px)
				'digit': '5rem', // Taille personnalisée en rem (équivalent à 24px si base 16px)
			},
			width: {
				'responsive': '100%',
				'hover': '100%',
				'focus': '100%',
				'landscape': '100%',
				'portrait': '100%',
			},
			height: {
				'responsive': '100%',
				'hover': '100%',
				'focus': '100%',
				'landscape': '100%',
				'portrait': '100%',
			},
		}
	},

	plugins: [daisyui, typography, forms],

	daisyui: {
		themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
		darkTheme: "light", // name of one of the included themes for dark mode
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		utils: true, // adds responsive and modifier utility classes
		prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
		logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
		themeRoot: ":root", // The element that receives theme color CSS variables
	},
} satisfies Config;

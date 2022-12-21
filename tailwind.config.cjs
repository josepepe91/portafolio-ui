/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'yellow': '#FFD275',
				'yellow-light': '#ffdace',
				'teal': '#78D5D7',
				'teal-dark': '#084C61',
				'purple': '#9381FF',
				'red': '#FF5A5F',
				'white': '#fff',
				'white-dark': '#EFEFEF',
				'gray': '#555555',
				'gray-light': '#90aab7',
				'black': '#05091e',
				'blue': '#46b4ff',
				'green': '#9ef2cb',
				'pink': '#ffb8d9',
				'orange': '#ffb7a3',
			}
		},
	},
	plugins: [],
}

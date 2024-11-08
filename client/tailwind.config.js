/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"Lexend",
					{
						fontVariationSettings: '"wght" 500',
					},
				],
				serif: [
					"Lexend",
					{
						fontVariationSettings: '"wght" 400',
					},
				],
			},
			colors: {
				primary: "rgb(2, 122, 14)",
				secondary: "#E9E3B4",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};

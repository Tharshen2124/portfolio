// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Hanken Grotesk',
			cssVariable: '--font-sans',
			weights: ['100 900'],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
		},
	],
});

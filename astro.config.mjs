// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/data/site';

// https://astro.build/config
export default defineConfig({
	site: site.url,
	// Build `experience.html` rather than `experience/index.html` so Cloudflare's
	// auto-trailing-slash serves `/experience` with no redirect, matching our links.
	trailingSlash: 'never',
	build: {
		format: 'file',
	},
	integrations: [sitemap()],
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

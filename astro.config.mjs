// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/data/site';

// The original design's copies of write-ups and projects point their canonical
// URL at the main design's pages, so only those belong in the sitemap.
const duplicate = /\/original\/(experience\/|projects$)/;

// https://astro.build/config
export default defineConfig({
	site: site.url,
	// Build `experience.html` rather than `experience/index.html` so Cloudflare's
	// auto-trailing-slash serves `/experience` with no redirect, matching our links.
	trailingSlash: 'never',
	build: {
		format: 'file',
	},
	// Pages that only exist in the original design now. public/_redirects sends
	// real 301s on Cloudflare; these cover `astro dev` and any other host.
	redirects: {
		'/experience': '/original/experience',
		'/blog': '/original/blog',
	},
	integrations: [sitemap({ filter: (page) => !duplicate.test(page) })],
	fonts: [
		{
			// The original design.
			provider: fontProviders.fontsource(),
			name: 'Hanken Grotesk',
			cssVariable: '--font-sans',
			weights: ['100 900'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['sans-serif'],
		},
		{
			// The game design's carved capitals: menus, titles and labels.
			provider: fontProviders.fontsource(),
			name: 'Cinzel',
			cssVariable: '--font-carved',
			weights: ['400 700'],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'serif'],
		},
		{
			// The game design's reading face: descriptions and write-ups.
			provider: fontProviders.fontsource(),
			name: 'EB Garamond',
			cssVariable: '--font-book',
			weights: ['400 700'],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'serif'],
		},
		{
			// The game design's italics: a calligraphic hand that stays easy to read
			// at small sizes, unlike Garamond's italic.
			provider: fontProviders.fontsource(),
			name: 'Alegreya',
			cssVariable: '--font-italic',
			weights: ['400 700'],
			styles: ['italic'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'serif'],
		},
	],
});

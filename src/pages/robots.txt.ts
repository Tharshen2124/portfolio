import type { APIRoute } from 'astro';

// Mirrors AI Crawl Control on Cloudflare: search engines and assistants that
// fetch pages for a user are welcome; training crawlers are blocked there.
const allowedAiCrawlers = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'Claude-SearchBot',
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended',
	'Applebot-Extended',
];

const blockedAiCrawlers = ['ClaudeBot', 'Claude-User', 'CCBot', 'Amazonbot', 'Bytespider'];

export const GET: APIRoute = ({ site }) => {
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		...allowedAiCrawlers.map((bot) => `User-agent: ${bot}`),
		'Allow: /',
		'',
		...blockedAiCrawlers.map((bot) => `User-agent: ${bot}`),
		'Disallow: /',
		'',
		`Sitemap: ${new URL('sitemap-index.xml', site).href}`,
		'',
	].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

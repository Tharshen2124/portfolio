import type { APIRoute } from 'astro';

// All crawlers, including AI search, assistant and training bots, are welcome.
export const GET: APIRoute = ({ site }) => {
	const body = [
		'User-agent: *',
		'Allow: /',
		'',
		`Sitemap: ${new URL('sitemap-index.xml', site).href}`,
		'',
	].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

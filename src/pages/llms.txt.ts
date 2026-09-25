import type { APIRoute } from 'astro';
import { site } from '../data/site';
import { getExperience, hasWriteup } from '../lib/experience';
import { formatDay, formatRange } from '../lib/format';
import { getSubstackFeed } from '../lib/substack';
import { absoluteUrl } from '../lib/seo';

/** Site overview for LLMs, following https://llmstxt.org. */
export const GET: APIRoute = async () => {
	const experience = (await getExperience()).filter(hasWriteup);
	const { posts } = await getSubstackFeed();

	const body = [
		`# ${site.name}`,
		'',
		`> ${site.description}`,
		'',
		`${site.name} (Tharshen) is a Computer Science student at ${site.university.name} in Malaysia, working towards DevOps and Site Reliability Engineering roles. Tharshen interned as a full stack engineer at iFAST Global Hub AI and as a web engineer at MoneyLion, led IT Society and Hackerspace MMU as President, and directed BarCamp Cyberjaya. These days Tharshen is learning observability with OpenTelemetry and the VictoriaMetrics stack and writing about it on Substack.`,
		'',
		'Each experience write-up below links to a plain-Markdown version; the HTML page is at the same path without `.md`.',
		'',
		'## Experience',
		'',
		...experience.map(
			(entry) =>
				`- [${entry.data.title}](${absoluteUrl(`/experience/${entry.id}.md`)}): ${entry.data.role}, ${entry.data.organization} (${formatRange(entry.data.startDate, entry.data.endDate)}). ${entry.data.summary}`,
		),
		'',
		'## Writing',
		'',
		...(posts.length > 0
			? posts.map((post) => `- [${post.title}](${post.url}): ${formatDay(post.date)}`)
			: [`- [Blog on Substack](${site.substackUrl})`]),
		'',
		'## Links',
		'',
		`- [Home](${absoluteUrl('/')})`,
		`- [All experience](${absoluteUrl('/experience')})`,
		`- [GitHub](${site.links.github})`,
		`- [LinkedIn](${site.links.linkedin})`,
		`- [Substack](${site.links.substack})`,
		'',
	].join('\n');

	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

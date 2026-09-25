import type { APIRoute, GetStaticPaths } from 'astro';
import { getExperience, hasWriteup, type Experience } from '../../lib/experience';
import { formatRange } from '../../lib/format';
import { absoluteUrl } from '../../lib/seo';

/** Plain-Markdown copy of each write-up, for LLMs and other agents. */
export const getStaticPaths = (async () => {
	const entries = await getExperience();
	return entries.filter(hasWriteup).map((entry) => ({
		params: { id: entry.id },
		props: { entry },
	}));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ entry: Experience }> = ({ props: { entry } }) => {
	const { title, role, organization, startDate, endDate, location, summary, skills, links } =
		entry.data;

	const details = [
		`- Role: ${role}, ${organization}`,
		`- Dates: ${formatRange(startDate, endDate)}`,
		location && `- Location: ${location}`,
		skills.length > 0 && `- Skills: ${skills.join(', ')}`,
		`- Web version: ${absoluteUrl(`/experience/${entry.id}`)}`,
	].filter(Boolean);

	const body = [
		`# ${title}`,
		'',
		`> ${summary}`,
		'',
		...details,
		'',
		entry.body!.trim(),
		...(links.length > 0 ? ['', '## Links', '', ...links.map(({ label, url }) => `- [${label}](${url})`)] : []),
		'',
	].join('\n');

	return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};

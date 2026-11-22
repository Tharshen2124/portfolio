import { getCollection, type CollectionEntry } from 'astro:content';
import { absoluteUrl, breadcrumbSchema, graph, personId, personSchema, type JsonLd } from './seo';

export type Experience = CollectionEntry<'experience'>;

/** Each category, and its page in the main (game) design. */
export const categories = [
	{ id: 'work', label: 'Work Experience', path: '/work' },
	{ id: 'volunteer', label: 'Volunteer Experience', path: '/volunteer' },
] as const;

/** Entries without a Markdown body are listed but don't get their own page. */
export function hasWriteup(entry: Experience): boolean {
	return Boolean(entry.body?.trim());
}

export function experienceHref(entry: Experience): string | undefined {
	return hasWriteup(entry) ? `/experience/${entry.id}` : undefined;
}

/** All experience entries, most recent first. */
export async function getExperience(): Promise<Experience[]> {
	const entries = await getCollection('experience');
	return entries.sort((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime());
}

/** The page that lists an entry in the main (game) design. */
export function categoryPage(entry: Experience): { name: string; path: string } {
	const { label, path } = categories.find(({ id }) => id === entry.data.category)!;
	return { name: label, path };
}

/** Article schema for a write-up, pointing at its canonical page under /experience. */
export function writeupSchema(entry: Experience): JsonLd {
	const { title, organization, summary, skills } = entry.data;
	const path = `/experience/${entry.id}`;
	return graph(
		{
			'@type': 'Article',
			'@id': `${absoluteUrl(path)}#article`,
			url: absoluteUrl(path),
			mainEntityOfPage: absoluteUrl(path),
			headline: title,
			description: summary,
			author: { '@id': personId },
			about: { '@type': 'Organization', name: organization },
			keywords: skills.join(', '),
			inLanguage: 'en',
		},
		personSchema(),
		breadcrumbSchema([{ name: 'Home', path: '/' }, categoryPage(entry), { name: title, path }]),
	);
}

/** Collection schema for a category's page in the main design. */
export function categorySchema(category: Experience['data']['category'], entries: Experience[], description: string): JsonLd {
	const { label, path } = categories.find(({ id }) => id === category)!;
	const writeups = entries.filter(hasWriteup);
	return graph(
		{
			'@type': 'CollectionPage',
			url: absoluteUrl(path),
			name: label,
			description,
			author: { '@id': personId },
			mainEntity: {
				'@type': 'ItemList',
				itemListElement: writeups.map((entry, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: entry.data.title,
					url: absoluteUrl(experienceHref(entry)!),
				})),
			},
		},
		personSchema(),
		breadcrumbSchema([
			{ name: 'Home', path: '/' },
			{ name: label, path },
		]),
	);
}

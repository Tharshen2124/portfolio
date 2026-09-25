import { getCollection, type CollectionEntry } from 'astro:content';

export type Experience = CollectionEntry<'experience'>;

export const categories = [
	{ id: 'work', label: 'Work' },
	{ id: 'university', label: 'University' },
	{ id: 'volunteer', label: 'Volunteer' },
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

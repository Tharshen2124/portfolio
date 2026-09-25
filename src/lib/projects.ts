import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** All projects, in the order set in src/content/projects.yaml. */
export async function getProjects(): Promise<Project[]> {
	const entries = await getCollection('projects');
	return entries.sort((a, b) => a.data.order - b.data.order);
}

/** Projects by start date, most recent first. */
export async function getRecentProjects(): Promise<Project[]> {
	const entries = await getCollection('projects');
	return entries.sort((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime());
}

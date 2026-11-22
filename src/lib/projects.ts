import { getCollection, type CollectionEntry } from 'astro:content';
import { absoluteUrl, breadcrumbSchema, graph, personId, personSchema, type JsonLd } from './seo';

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

export const projectsDescription =
	"Tharshen's projects: observability with VictoriaMetrics and OpenTelemetry, a Kubernetes platform lab, and community tools.";

/** Collection schema for the projects page, at its canonical path /projects. */
export function projectsSchema(projects: Project[]): JsonLd {
	return graph(
		{
			'@type': 'CollectionPage',
			url: absoluteUrl('/projects'),
			name: 'Projects',
			description: projectsDescription,
			author: { '@id': personId },
			mainEntity: {
				'@type': 'ItemList',
				itemListElement: projects.map(({ data }, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					item: {
						'@type': 'SoftwareSourceCode',
						name: data.name,
						description: data.summary,
						codeRepository: data.repo,
						...(data.site && { url: data.site }),
						keywords: data.stack.join(', '),
						author: { '@id': personId },
					},
				})),
			},
		},
		personSchema(),
		breadcrumbSchema([
			{ name: 'Home', path: '/' },
			{ name: 'Projects', path: '/projects' },
		]),
	);
}

import { getImage } from 'astro:assets';
import { site } from '../data/site';
import avatar from '../assets/tharshen-avatar.jpg';

/** JSON-LD object; kept loose since schema.org shapes vary per type. */
export type JsonLd = Record<string, unknown>;

/** Stable id so other schemas can point at the Person without repeating it. */
export const personId = `${site.url}/#person`;

/**
 * Public path of a page. With `build.format: 'file'`, `Astro.url` includes the
 * `.html` filename at build time (`/experience.html`), but it's served at `/experience`.
 */
export function pagePath(url: URL): string {
	return url.pathname.replace(/(\/index)?\.html$/, '').replace(/\/$/, '') || '/';
}

export function absoluteUrl(path: string): string {
	return new URL(path, site.url).href;
}

export function personSchema(image?: string): JsonLd {
	return {
		'@type': 'Person',
		'@id': personId,
		name: site.name,
		url: site.url,
		...(image && { image }),
		description: site.description,
		jobTitle: site.jobTitle,
		affiliation: { '@type': 'CollegeOrUniversity', ...site.university },
		knowsAbout: site.knowsAbout,
		sameAs: Object.values(site.links),
	};
}

export function breadcrumbSchema(items: { name: string; path: string }[]): JsonLd {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map(({ name, path }, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name,
			item: absoluteUrl(path),
		})),
	};
}

/** Wraps one or more schemas in a single `@graph` document. */
export function graph(...nodes: JsonLd[]): JsonLd {
	return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Square avatar used for og:image and the Person schema. */
export async function defaultImage() {
	const image = await getImage({ src: avatar, width: 400, height: 400, format: 'jpg' });
	return { url: absoluteUrl(image.src), width: 400, height: 400, alt: `Portrait of ${site.name}` };
}

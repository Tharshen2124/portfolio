/** The screens off the title menu, in menu order. The left and right arrows step around them. */
export const sections = [
	{ path: '/work', label: 'Work Experience', short: 'Work' },
	{ path: '/volunteer', label: 'Volunteer Experience', short: 'Volunteer' },
	{ path: '/projects', label: 'Projects', short: 'Projects' },
] as const;

export type SectionPath = (typeof sections)[number]['path'];

/** The screens either side of one, wrapping round. */
export function neighbours(path: SectionPath) {
	const i = sections.findIndex((section) => section.path === path);
	return {
		previous: sections[(i + sections.length - 1) % sections.length],
		next: sections[(i + 1) % sections.length],
	};
}

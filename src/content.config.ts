import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const experience = defineCollection({
	loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
	schema: z.object({
		/** Headline shown in lists and on the entry page. */
		title: z.string(),
		role: z.string(),
		organization: z.string(),
		category: z.enum(['work', 'volunteer']),
		startDate: z.coerce.date(),
		/** Leave out for ongoing roles. */
		endDate: z.coerce.date().optional(),
		/** Shown in the home page's Volunteer Highlights. */
		featured: z.boolean().default(false),
		location: z.string().optional(),
		summary: z.string(),
		skills: z.array(z.string()).default([]),
		links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
	}),
});

const projects = defineCollection({
	loader: file('./src/content/projects.yaml'),
	schema: z.object({
		/** Position on the projects page, matching the GitHub pinned order. */
		order: z.number(),
		name: z.string(),
		/** When work started; the home page shows the most recent projects. */
		startDate: z.coerce.date(),
		/** One or two sentences; the repository has the rest. */
		summary: z.string(),
		stack: z.array(z.string()).default([]),
		repo: z.url(),
		site: z.url().optional(),
		/** Internal path to a related experience write-up. */
		writeup: z.string().optional(),
	}),
});

export const collections = { experience, projects };

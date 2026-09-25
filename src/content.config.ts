import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const experience = defineCollection({
	loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
	schema: z.object({
		/** Headline shown in lists and on the entry page. */
		title: z.string(),
		role: z.string(),
		organization: z.string(),
		category: z.enum(['work', 'university', 'volunteer']),
		startDate: z.coerce.date(),
		/** Leave out for ongoing roles. */
		endDate: z.coerce.date().optional(),
		location: z.string().optional(),
		summary: z.string(),
		skills: z.array(z.string()).default([]),
		links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
	}),
});

export const collections = { experience };

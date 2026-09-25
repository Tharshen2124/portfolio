import { site } from '../data/site';

export interface SubstackPost {
	title: string;
	url: string;
	date: Date;
	description?: string;
}

export interface SubstackFeed {
	description?: string;
	posts: SubstackPost[];
}

const FEED_URL = `${site.substackUrl}/feed`;

let cached: Promise<SubstackFeed> | undefined;

function readTag(xml: string, tag: string): string | undefined {
	const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
	if (!match) return undefined;
	return decodeEntities(match[1].replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, '$1').trim());
}

function decodeEntities(text: string): string {
	return text
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&amp;/g, '&');
}

async function loadFeed(): Promise<SubstackFeed> {
	try {
		const res = await fetch(FEED_URL);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const xml = await res.text();

		// Channel description sits before the first <item>.
		const channel = xml.split('<item>')[0];
		const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
			.map(([, item]) => ({
				title: readTag(item, 'title') ?? 'Untitled',
				url: readTag(item, 'link') ?? site.substackUrl,
				date: new Date(readTag(item, 'pubDate') ?? 0),
				description: readTag(item, 'description'),
			}))
			.sort((a, b) => b.date.getTime() - a.date.getTime());

		return { description: readTag(channel, 'description'), posts };
	} catch (error) {
		// Never fail the build because Substack is unreachable.
		console.warn(`[substack] Could not load ${FEED_URL}:`, error);
		return { posts: [] };
	}
}

/** Fetches the Substack RSS feed once per build. */
export function getSubstackFeed(): Promise<SubstackFeed> {
	cached ??= loadFeed();
	return cached;
}

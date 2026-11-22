/** Where the original, plain design of the site lives. */
export const ORIGINAL_BASE = '/original';

/** The original design's copy of a site path: `/experience/x` becomes `/original/experience/x`. */
export function originalPath(path: string): string {
	return path === '/' ? ORIGINAL_BASE : `${ORIGINAL_BASE}${path}`;
}

/**
 * Write-ups link to each other with root paths (`/experience/...`), which now
 * lead to the game design. Inside the original design, point them at its own copies.
 */
export function toOriginalLinks(html: string): string {
	return html.replace(/href="\/experience\//g, `href="${ORIGINAL_BASE}/experience/`);
}

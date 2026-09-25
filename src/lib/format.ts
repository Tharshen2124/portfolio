const monthFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC',
});

const dayFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC',
});

/** "Jul 2025" */
export function formatMonth(date: Date): string {
	return monthFormatter.format(date);
}

/** "April 9, 2024" */
export function formatDay(date: Date): string {
	return dayFormatter.format(date);
}

/** "Jul 2025 – Oct 2025", or "Nov 2024 – Present" when there's no end date. */
export function formatRange(start: Date, end?: Date): string {
	const from = formatMonth(start);
	if (!end) return `${from} – Present`;
	const to = formatMonth(end);
	return from === to ? from : `${from} – ${to}`;
}

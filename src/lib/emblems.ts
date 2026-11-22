/**
 * Small inked emblems that sit in medallions and badge frames, in the same
 * hand as the ornaments. Each is drawn on a 48 by 48 grid.
 */
import { bezier, dot, drop, ink, join, leaf, mirrorX, ring, swell, toPath, type Pt } from './filigree.ts';

const C = 24;
const line = (from: Pt, to: Pt, w = 2.2) => ink(bezier(from, from, to, to, 12), swell(w * 0.8, w, w * 0.8, 0.5));
const arc = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, w = 2.2) => ink(bezier(p0, p1, p2, p3), swell(w * 0.55, w, w * 0.55, 0.5));
const polygon = (points: Pt[], w = 2) => ink([...points, points[0], points[1]], () => w);

/** Observability: an open eye with rays above it. */
function eye() {
	const rays: Pt[][] = [
		leaf([C, 11], [C, 3], 2.6),
		leaf([C + 7, 13], [C + 11, 6], 2.4),
		leaf([C + 13, 17], [C + 19, 12], 2.2),
	];
	return toPath([
		arc([6, 28], [14, 16], [34, 16], [42, 28]),
		arc([6, 28], [14, 39], [34, 39], [42, 28]),
		ring([C, 27.5], 6.4, 2.2),
		dot([C, 27.5], 2.6),
		...rays,
		...mirrorX(rays.slice(1), C),
	]);
}

/** A timer for each talk: an hourglass in its frame. */
function hourglass() {
	const half: Pt[][] = [
		arc([15, 10], [15, 20], [23, 21], [23, 24], 2),
		arc([15, 38], [15, 28], [23, 27], [23, 24], 2),
	];
	return toPath([
		line([11, 8], [37, 8], 2.6),
		line([11, 40], [37, 40], 2.6),
		line([12.5, 9], [12.5, 39], 1.4),
		line([35.5, 9], [35.5, 39], 1.4),
		...half,
		...mirrorX(half, C),
		...drop([C, 36], [C, 29], 5),
		dot([C, 17], 1.4),
	]);
}

/** A community that builds: a cluster of hive cells. */
function hive() {
	const cell = (cx: number, cy: number, r: number): Pt[] =>
		Array.from({ length: 6 }, (_, i) => {
			const a = ((60 * i - 90) * Math.PI) / 180;
			return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as Pt;
		});
	return toPath([
		polygon(cell(C, 16, 8.5)),
		polygon(cell(C - 7.6, 29, 8.5)),
		polygon(cell(C + 7.6, 29, 8.5)),
		dot([C, 16], 2.2),
		dot([C - 7.6, 29], 1.5),
		dot([C + 7.6, 29], 1.5),
	]);
}

/** A ship's helm, for steering a cluster. */
function helm() {
	const spokes = Array.from({ length: 8 }, (_, i) => {
		const a = (i * Math.PI) / 4;
		const at = (r: number): Pt => [C + Math.cos(a) * r, C + Math.sin(a) * r];
		return [leaf(at(4), at(21), 2.6, 0.7), dot(at(21.5), 2)];
	}).flat();
	return toPath([ring([C, C], 12.5, 2.4), ring([C, C], 4, 2), ...spokes]);
}

/** Leading a society or an event: a crown. */
function crown() {
	const points: Pt[][] = [leaf([C, 30], [C, 10], 6, 0.6), leaf([C - 10, 30], [C - 15, 14], 5, 0.6)];
	return toPath([
		...points,
		...mirrorX(points.slice(1), C),
		arc([10, 30], [18, 27], [30, 27], [38, 30], 2.6),
		line([11, 35], [37, 35], 2.6),
		dot([C, 8.5], 2.2),
		dot([C - 15.5, 12.5], 1.8),
		dot([C + 15.5, 12.5], 1.8),
	]);
}

/** Keeping the records: a quill. */
function quill() {
	const spine = bezier([13, 40], [20, 28], [28, 16], [37, 6]);
	return toPath([
		ink(spine, swell(1.2, 2.2, 0.6, 0.3)),
		ink(bezier([20, 29], [22, 18], [30, 10], [37, 6]), swell(0.6, 5, 0.4, 0.55)),
		ink(bezier([20, 29], [27, 28], [34, 18], [37, 6]), swell(0.6, 4.4, 0.4, 0.5)),
		...drop([12.2, 41.5], [9, 44.5], 2.4),
	]);
}

/** Building the tools: a cog. */
function cog() {
	const teeth = Array.from({ length: 8 }, (_, i) => {
		const a = (i * Math.PI) / 4 + Math.PI / 8;
		const at = (r: number): Pt => [C + Math.cos(a) * r, C + Math.sin(a) * r];
		return leaf(at(11), at(19.5), 6.4, 0.45);
	});
	return toPath([ring([C, C], 12, 3), ring([C, C], 4.6, 2.2), ...teeth]);
}

/** Guiding newcomers: a lantern with its flame. */
function lantern() {
	const cage: Pt[][] = [arc([16, 16], [13, 22], [13, 30], [16, 36], 2.2)];
	return toPath([
		ring([C, 6.5], 2.6, 1.8),
		line([16, 13], [32, 13], 2.6),
		line([15, 38.5], [33, 38.5], 2.6),
		ink(join(bezier([19, 13], [19, 11], [29, 11], [29, 13])), () => 2),
		...cage,
		...mirrorX(cage, C),
		...drop([C, 32], [C, 20], 6.4),
		dot([C, 31.5], 1.4),
		leaf([C, 38.5], [C, 45], 3),
	]);
}

/** Capturing an event: a camera. */
function camera() {
	return toPath([
		polygon(
			[
				[8, 15],
				[17, 15],
				[20, 10],
				[28, 10],
				[31, 15],
				[40, 15],
				[40, 37],
				[8, 37],
			],
			2.2,
		),
		ring([C, 26], 7, 2.2),
		dot([C, 26], 2.8),
		dot([34.5, 20], 1.6),
	]);
}

/** Pitching in: a pennant on its staff. */
function pennant() {
	return toPath([
		line([13, 6], [13, 43], 2.4),
		dot([13, 5], 2.2),
		ink(join(bezier([14, 9], [24, 11], [32, 13], [39, 17]), bezier([39, 17], [32, 21], [24, 23], [14, 26])), swell(2.6, 2.2, 2.6, 0.5)),
		ink(bezier([14, 14], [21, 15], [26, 16], [30, 17.5]), swell(1.6, 1.2, 0.3, 0.2)),
		line([8, 43], [18, 43], 2.4),
	]);
}

export const emblems = {
	eye: eye(),
	hourglass: hourglass(),
	hive: hive(),
	helm: helm(),
	crown: crown(),
	quill: quill(),
	cog: cog(),
	lantern: lantern(),
	camera: camera(),
	pennant: pennant(),
} satisfies Record<string, string>;

export type EmblemName = keyof typeof emblems;

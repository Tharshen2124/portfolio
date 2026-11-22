/**
 * The game design's filigree, drawn with the calligraphy kit in ./filigree.ts.
 * Every piece is original line work in the manner of carved and inked
 * menu scrollwork: swelling strokes that curl into ball-tipped spirals.
 */
import {
	bezier,
	curl,
	dot,
	drop,
	endHeading,
	ink,
	join,
	leaf,
	mirrorX,
	mirrorY,
	ring,
	swell,
	toPath,
	type Ornament,
	type Pt,
} from './filigree.ts';

/** A scroll stroke that ends in a ball, the signature terminal of the set. */
function tendril(line: Pt[], start: number, peak: number, end: number, ball: number, at = 0.35): Pt[][] {
	return [ink(line, swell(start, peak, end, at)), dot(line[line.length - 1], ball)];
}

/** Selection pointer, aimed right: set to the left of the chosen item and mirrored on its right. */
function pointer(): Ornament {
	const cy = 18;
	const upper: Pt[][] = [
		// Wing sweeping back from the head and rolling outward.
		...tendril(curl([37, 15.5], -158, 30, 1.05, 1), 3.4, 3.6, 1.1, 1.7, 0.2),
		// Small inner curl near the tail.
		...tendril(curl([16, 16.4], -128, 13, 0.85, -1), 2, 2.2, 0.8, 1.15, 0.25),
	];
	const shapes: Pt[][] = [
		// Spear head.
		leaf([33, cy], [63, cy], 10.5, 0.36),
		// Shaft.
		ink(bezier([5, cy], [15, cy], [25, cy], [36, cy]), swell(0.6, 2.6, 2.2, 0.7)),
		// Diamond tail.
		leaf([1, cy], [9, cy], 5, 0.5),
		...upper,
		...mirrorY(upper, cy),
	];
	return { width: 64, height: 36, d: toPath(shapes) };
}

/** Centre piece of the line under a title; CSS draws the long hairlines either side. */
function divider(): Ornament {
	const cx = 130;
	const cy = 22;
	const wave = bezier([156, cy + 1], [176, cy + 9], [198, cy + 7], [214, cy - 1]);
	const half: Pt[][] = [
		// Beside the lantern: one scroll rolling up, one rolling down.
		...tendril(curl([140, cy - 2.5], -8, 40, 1.15, -1, 0.25), 3, 3.4, 1, 1.7, 0.3),
		...tendril(curl([140, cy + 2.5], 8, 34, 1.1, 1, 0.25), 2.6, 3, 0.9, 1.5, 0.3),
		// Long wave reaching outward and rolling up at its end.
		...tendril(join(wave, curl([214, cy - 1], endHeading(wave), 32, 1.05, -1, 0.2)), 1, 3.4, 0.9, 1.6, 0.3),
		// Whisker trailing off toward the hairline.
		ink(bezier([206, cy + 4], [222, cy + 8], [240, cy + 5], [258, cy + 2]), swell(2.2, 1.5, 0.2, 0.15)),
		leaf([178, cy + 3], [192, cy - 4], 4.2),
	];
	const lantern: Pt[][] = [
		// Lantern: a lozenge with a flame inside, a finial above and a drop below.
		ink(
			[
				[cx, cy - 13],
				[cx + 7.5, cy],
				[cx, cy + 13],
				[cx - 7.5, cy],
				[cx, cy - 13],
				[cx + 7.5, cy],
			],
			() => 2.4,
		),
		...drop([cx, cy + 3], [cx, cy - 7], 4.6),
		dot([cx, cy - 18], 2),
		...drop([cx, cy + 16], [cx, cy + 25], 4),
	];
	return { width: 260, height: 50, d: toPath([...half, ...mirrorX(half, cx), ...lantern]) };
}

/** Crown over a menu: a central spire on a fan of scrolls, with long arms. */
function crown(): Ornament {
	const cx = 160;
	const base = 66;
	const half: Pt[][] = [
		// Petals beside the spire, rolling outward.
		...tendril(curl([cx + 3, base - 6], -70, 34, 1.1, 1), 3.4, 4, 1.1, 1.9, 0.25),
		...tendril(curl([cx + 6, base - 2], -18, 26, 1, 1), 2.8, 3.2, 1, 1.6, 0.3),
		// Arm: a long S running outward, ending in a downward curl.
		...tendril(
			join(
				bezier([cx + 14, base + 1], [cx + 50, base + 6], [cx + 80, base - 10], [cx + 112, base - 6]),
				curl([cx + 112, base - 6], 10, 30, 1.05, 1),
			),
			1.4,
			3.6,
			1,
			1.7,
			0.3,
		),
		...tendril(curl([cx + 62, base - 3], -95, 22, 0.95, -1), 2.2, 2.6, 0.8, 1.3, 0.3),
		ink(bezier([cx + 130, base - 1], [cx + 140, base - 2], [cx + 150, base - 6], [cx + 158, base - 9]), swell(2.2, 1.6, 0.2, 0.1)),
	];
	const centre: Pt[][] = [
		leaf([cx, base - 4], [cx, 4], 13, 0.4),
		...mirrorX([leaf([cx - 3, base - 10], [cx - 15, base - 36], 6)], cx),
		leaf([cx - 3, base - 10], [cx - 15, base - 36], 6),
		ring([cx, base + 3], 4.6, 2.2),
		...drop([cx, base + 9], [cx, base + 17], 4),
	];
	return { width: 320, height: 86, d: toPath([...half, ...mirrorX(half, cx), ...centre]) };
}

/** Flourish closing a menu or panel: two scrolls meeting over a drop. */
function base(): Ornament {
	const cx = 100;
	const cy = 14;
	const arm = bezier([cx + 3, cy + 4], [cx + 22, cy + 12], [cx + 48, cy + 10], [cx + 64, cy + 1]);
	const half: Pt[][] = [
		...tendril(join(arm, curl([cx + 64, cy + 1], endHeading(arm), 28, 1.05, -1, 0.2)), 1.6, 3.4, 1, 1.6, 0.3),
		...tendril(curl([cx + 14, cy + 7], -60, 22, 1, -1), 2.4, 2.8, 0.8, 1.4, 0.3),
	];
	const centre: Pt[][] = [...drop([cx, cy + 3], [cx, cy + 18], 6), dot([cx, cy - 5], 2)];
	return { width: 200, height: 34, d: toPath([...half, ...mirrorX(half, cx), ...centre]) };
}

/** Top-left corner of a framed panel; CSS flips it for the other corners. */
function corner(): Ornament {
	// The top arm sweeps in from the right and winds into the corner's spiral.
	const top = bezier([178, 7], [128, 5], [76, 8], [46, 15]);
	const knot = curl([46, 15], endHeading(top), 88, 1.3, -1, 0.3);
	// The side arm leaves the spiral's foot and falls down the edge to a curl.
	const side = bezier([34, 46], [18, 60], [13, 98], [13, 146]);
	const shapes: Pt[][] = [
		...tendril(join(top, knot), 0.3, 6, 1.3, 2.4, 0.55),
		...tendril(join(side, curl([13, 146], endHeading(side), 26, 1.05, -1, 0.2)), 5.4, 4.4, 1.1, 1.9, 0.1),
		// A fine second line under the top arm.
		ink(bezier([62, 23], [90, 19], [120, 18], [150, 14]), swell(2.6, 1.8, 0.2, 0.1)),
		// Small scrolls tucked inside the corner.
		...tendril(curl([24, 70], 60, 28, 1.15, -1, 0.2), 3, 3, 0.9, 1.5, 0.25),
		...tendril(curl([62, 30], 100, 24, 1.1, 1, 0.2), 2.8, 2.8, 0.8, 1.4, 0.25),
		leaf([26, 92], [36, 110], 4),
	];
	return { width: 180, height: 180, d: toPath(shapes) };
}

/** Arrow on a panel's side, aimed left: a long barb on a spindle, curls at its back. */
function sideArrow(): Ornament {
	const cy = 60;
	const back: Pt[][] = [...tendril(curl([30, cy - 4], -70, 22, 1, 1, 0.2), 2.6, 3, 0.9, 1.4, 0.3)];
	const shapes: Pt[][] = [
		leaf([28, 8], [28, 112], 4.5, 0.5),
		leaf([36, cy], [1, cy], 15, 0.26),
		...back,
		...mirrorY(back, cy),
	];
	return { width: 44, height: 120, d: toPath(shapes) };
}

/** Crook at the left end of a save-slot line; CSS carries its top stroke on as a hairline. */
function hook(): Ornament {
	const shapes: Pt[][] = [
		// Top stroke coming in from the right and turning down.
		ink(join(bezier([60, 9], [40, 8], [24, 8], [16, 14]), bezier([16, 14], [8, 20], [10, 30], [12, 40])), swell(2.4, 4, 3.2, 0.6)),
		// Long fall to a curl at the foot.
		...tendril(join(bezier([12, 40], [14, 56], [10, 70], [12, 80]), curl([12, 80], 88, 22, 1.05, -1)), 3.2, 3.6, 1, 1.7, 0.2),
		// A curl tucked under the top.
		...tendril(curl([22, 13], 30, 18, 1, 1), 2.4, 2.6, 0.8, 1.3, 0.3),
		leaf([34, 6], [50, 1.5], 3.2),
	];
	return { width: 60, height: 100, d: toPath(shapes) };
}

/** Finial topping the scroll rail: a spear head over a ring and two curls. */
function finial(): Ornament {
	const cx = 14;
	const side: Pt[][] = [...tendril(curl([cx + 1.5, 34], 20, 15, 0.95, 1), 2.2, 2.4, 0.8, 1.2, 0.3)];
	const shapes: Pt[][] = [
		leaf([cx, 28], [cx, 1], 8.5, 0.42),
		ring([cx, 32], 3.2, 1.8),
		...side,
		...mirrorX(side, cx),
		ink(bezier([cx, 35], [cx, 45], [cx, 55], [cx, 64]), swell(2.4, 1.4, 1.2, 0.3)),
	];
	return { width: 28, height: 64, d: toPath(shapes) };
}

/** One corner bracket of the selection frame around a chosen item; CSS flips it for the others. */
function bracket(): Ornament {
	const across = bezier([7, 5], [12, 4.4], [17, 4.4], [22, 5.6]);
	const down = bezier([5, 7], [4.4, 12], [4.4, 17], [5.6, 22]);
	const shapes: Pt[][] = [
		...tendril(join(across, curl([22, 5.6], endHeading(across), 13, 0.9, 1, 0.3)), 2.4, 2.8, 1, 1.25, 0.3),
		...tendril(join(down, curl([5.6, 22], endHeading(down), 13, 0.9, -1, 0.3)), 2.4, 2.8, 1, 1.25, 0.3),
		leaf([7.5, 7.5], [0.5, 0.5], 4),
	];
	return { width: 30, height: 30, d: toPath(shapes) };
}

/**
 * The title's crest: the lantern of the divider on a pendant, in finer and
 * more layered scrollwork, drawn wide so its strokes stay delicate when large.
 */
function crest(): Ornament {
	const cx = 260;
	const cy = 38;
	// The main wave grows from under the lantern; the outer wave branches off it.
	const mid = bezier([cx + 20, cy + 7], [cx + 54, cy + 17], [cx + 96, cy + 9], [cx + 124, cy - 4]);
	const outer = bezier([cx + 96, cy + 8], [cx + 140, cy + 17], [cx + 180, cy + 11], [cx + 204, cy]);
	const half: Pt[][] = [
		// Scrolls at the lantern's waist, one rolling up and one down.
		...tendril(curl([cx + 15, cy - 3.5], -10, 54, 1.2, -1, 0.25), 3, 3.3, 0.9, 1.8, 0.3),
		...tendril(curl([cx + 15, cy + 3.5], 12, 44, 1.15, 1, 0.25), 2.6, 3, 0.8, 1.6, 0.3),
		// The waves, each rolling up at its end, and a curl hanging beneath.
		...tendril(join(mid, curl([cx + 124, cy - 4], endHeading(mid), 40, 1.1, -1, 0.2)), 1.6, 3.4, 0.9, 1.7, 0.3),
		...tendril(join(outer, curl([cx + 204, cy], endHeading(outer), 28, 1.05, -1, 0.2)), 0.6, 2.8, 0.8, 1.4, 0.35),
		...tendril(curl([cx + 60, cy + 13], 40, 28, 1.05, 1, 0.25), 2.2, 2.5, 0.7, 1.3, 0.3),
		// Leaves along the waves, and a whisker trailing off to the side.
		leaf([cx + 82, cy + 9], [cx + 99, cy - 3], 4.8),
		leaf([cx + 150, cy + 12], [cx + 167, cy + 2], 4.2),
		ink(bezier([cx + 196, cy + 7], [cx + 216, cy + 11], [cx + 238, cy + 8], [cx + 258, cy + 4]), swell(2, 1.4, 0.2, 0.15)),
	];
	const lantern: Pt[][] = [
		ink(
			[
				[cx, cy - 16],
				[cx + 9, cy],
				[cx, cy + 16],
				[cx - 9, cy],
				[cx, cy - 16],
				[cx + 9, cy],
			],
			() => 2.5,
		),
		...drop([cx, cy + 4], [cx, cy - 9], 5.4),
		dot([cx, cy - 22], 2.2),
		leaf([cx, cy - 26], [cx, cy - 36], 3.2),
		// The pendant: a drop, a bead and a point.
		...drop([cx, cy + 20], [cx, cy + 33], 4.6),
		dot([cx, cy + 38], 2),
		leaf([cx, cy + 42], [cx, cy + 54], 3),
	];
	return { width: 520, height: 96, d: toPath([...half, ...mirrorX(half, cx), ...lantern]) };
}

export const ornaments = {
	pointer: pointer(),
	divider: divider(),
	crest: crest(),
	crown: crown(),
	base: base(),
	corner: corner(),
	'side-arrow': sideArrow(),
	hook: hook(),
	finial: finial(),
	bracket: bracket(),
} satisfies Record<string, Ornament>;

export type OrnamentName = keyof typeof ornaments;

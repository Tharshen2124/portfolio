/**
 * A small calligraphy kit for the game design's ornaments.
 *
 * Each stroke is laid out as a centre line (a Bézier curve, or a scroll whose
 * curvature changes evenly along its length), then given a width that changes
 * along that line and filled, so it swells and tapers like a brush stroke.
 * It runs at build time only: pages receive finished SVG path data.
 */

export type Pt = readonly [number, number];
/** Stroke width at a point `t` (0 to 1) along the stroke. */
type Width = (t: number) => number;

const rad = (deg: number) => (deg * Math.PI) / 180;
const ease = (x: number) => 0.5 - Math.cos(Math.PI * Math.min(1, Math.max(0, x))) / 2;

/** Samples per unit of length: enough for smooth curves at the sizes these are drawn. */
const DENSITY = 1.5;
const span = (...pts: Pt[]) => pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/** Centre line of a cubic Bézier curve. */
export function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, steps = Math.max(8, Math.ceil(span(p0, p1, p2, p3) * DENSITY))): Pt[] {
	const points: Pt[] = [];
	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		const u = 1 - t;
		const a = u * u * u;
		const b = 3 * u * u * t;
		const c = 3 * u * t * t;
		const d = t * t * t;
		points.push([
			a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
			a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
		]);
	}
	return points;
}

/**
 * Centre line whose curvature runs evenly from `k0` to `k1` (a clothoid).
 * Same signs give a curl that tightens; opposite signs give an S. Positive
 * curvature turns clockwise on screen. `heading` is in degrees, 0 = right.
 */
export function scroll(start: Pt, heading: number, length: number, k0: number, k1: number, steps = Math.max(16, Math.ceil(length * DENSITY * 1.5))): Pt[] {
	const points: Pt[] = [];
	const ds = length / steps;
	let [x, y] = start;
	let angle = rad(heading);
	for (let i = 0; i <= steps; i++) {
		points.push([x, y]);
		const k = k0 + ((k1 - k0) * (i + 0.5)) / steps;
		const mid = angle + (k * ds) / 2;
		x += Math.cos(mid) * ds;
		y += Math.sin(mid) * ds;
		angle += k * ds;
	}
	return points;
}

/**
 * A scroll that turns `turns` full circles in total, starting almost straight
 * and tightening into its centre. `dir` 1 curls clockwise, -1 anticlockwise.
 */
export function curl(start: Pt, heading: number, length: number, turns: number, dir: 1 | -1 = 1, lead = 0.04): Pt[] {
	// Total turn = length * (k0 + k1) / 2, with k0 a small fraction of k1.
	const total = turns * Math.PI * 2;
	const k1 = (2 * total) / (length * (1 + lead));
	return scroll(start, heading, length, dir * k1 * lead, dir * k1);
}

/** The heading (degrees) a centre line leaves its last point with. */
export function endHeading(line: Pt[]): number {
	const [a, b] = [line[line.length - 2], line[line.length - 1]];
	return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
}

/** Joins centre lines end to end into one. */
export function join(...lines: Pt[][]): Pt[] {
	return lines.flatMap((line, i) => (i === 0 ? line : line.slice(1)));
}

/** Width that grows from `start` to `peak` at `at` of the way along, then falls to `end`. */
export function swell(start: number, peak: number, end: number, at = 0.4): Width {
	return (t) =>
		t < at ? start + (peak - start) * ease(t / at) : peak + (end - peak) * ease((t - at) / (1 - at));
}

/** Even width. */
export const even = (width: number): Width => () => width;

/** Gives a centre line its width: the filled outline of the stroke. */
export function ink(line: Pt[], width: Width): Pt[] {
	const n = line.length;
	const along = [0];
	for (let i = 1; i < n; i++) {
		along.push(along[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
	}
	const total = along[n - 1] || 1;
	const left: Pt[] = [];
	const right: Pt[] = [];
	for (let i = 0; i < n; i++) {
		const a = line[Math.max(0, i - 1)];
		const b = line[Math.min(n - 1, i + 1)];
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const len = Math.hypot(dx, dy) || 1;
		const half = width(along[i] / total) / 2;
		const [nx, ny] = [-dy / len, dx / len];
		left.push([line[i][0] + nx * half, line[i][1] + ny * half]);
		right.push([line[i][0] - nx * half, line[i][1] - ny * half]);
	}
	return [...left, ...right.reverse()];
}

/** A filled circle. */
export function dot(centre: Pt, r: number, steps = 24): Pt[] {
	return Array.from({ length: steps }, (_, i) => {
		const a = (i / steps) * Math.PI * 2;
		return [centre[0] + Math.cos(a) * r, centre[1] + Math.sin(a) * r] as Pt;
	});
}

/** An almond: pointed at both ends, widest a little before its middle. */
export function leaf(from: Pt, to: Pt, width: number, widest = 0.42): Pt[] {
	return ink(bezier(from, lerpPt(from, to, 1 / 3), lerpPt(from, to, 2 / 3), to, 32), swell(0, width, 0, widest));
}

/** A teardrop: round at `from`, pointed at `to`. */
export function drop(from: Pt, to: Pt, width: number): Pt[][] {
	const line = bezier(from, lerpPt(from, to, 1 / 3), lerpPt(from, to, 2 / 3), to, 32);
	return [dot(from, width / 2), ink(line, (t) => width * Math.pow(1 - t, 0.8))];
}

/**
 * A ring: a circle drawn as a stroke. Its outline runs round the outside and
 * back round the inside, so the middle stays empty under the default fill rule.
 */
export function ring(centre: Pt, r: number, width: number, steps = 64): Pt[] {
	const circle = Array.from({ length: steps + 1 }, (_, i) => {
		const a = (i / steps) * Math.PI * 2;
		return [centre[0] + Math.cos(a) * r, centre[1] + Math.sin(a) * r] as Pt;
	});
	return ink(circle, even(width));
}

const lerpPt = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Reflects shapes across the vertical line x = `axis`. */
export function mirrorX(shapes: Pt[][], axis: number): Pt[][] {
	return shapes.map((shape) => shape.map(([x, y]) => [2 * axis - x, y] as Pt));
}

/** Reflects shapes across the horizontal line y = `axis`. */
export function mirrorY(shapes: Pt[][], axis: number): Pt[][] {
	return shapes.map((shape) => shape.map(([x, y]) => [x, 2 * axis - y] as Pt));
}

/** Twice the signed area: tells which way round a shape is drawn. */
function winding(shape: Pt[]): number {
	let sum = 0;
	for (let i = 0; i < shape.length; i++) {
		const [x1, y1] = shape[i];
		const [x2, y2] = shape[(i + 1) % shape.length];
		sum += x1 * y2 - x2 * y1;
	}
	return sum;
}

const num = (v: number) => {
	const s = v.toFixed(1).replace(/\.0$/, '');
	return s === '-0' ? '0' : s;
};

/**
 * Drops points of a closed outline that sit within `tolerance` of the line
 * through their neighbours. The outline is split at the point farthest from
 * its start first, since a stroke pointed at both ends starts where it ends.
 */
function simplify(points: Pt[], tolerance: number): Pt[] {
	if (points.length < 4) return points;
	const [x0, y0] = points[0];
	let split = 1;
	for (let i = 2; i < points.length; i++) {
		if (Math.hypot(points[i][0] - x0, points[i][1] - y0) > Math.hypot(points[split][0] - x0, points[split][1] - y0)) {
			split = i;
		}
	}
	return [...simplifyRun(points.slice(0, split + 1), tolerance).slice(0, -1), ...simplifyRun(points.slice(split), tolerance)];
}

/** Ramer-Douglas-Peucker on an open run of points. */
function simplifyRun(points: Pt[], tolerance: number): Pt[] {
	if (points.length < 3) return points;
	const keep = new Uint8Array(points.length);
	keep[0] = keep[points.length - 1] = 1;
	const stack: [number, number][] = [[0, points.length - 1]];
	while (stack.length) {
		const [first, last] = stack.pop()!;
		const [ax, ay] = points[first];
		const [bx, by] = points[last];
		const len = Math.hypot(bx - ax, by - ay) || 1;
		let far = -1;
		let worst = tolerance;
		for (let i = first + 1; i < last; i++) {
			const [px, py] = points[i];
			const d = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len;
			if (d > worst) {
				worst = d;
				far = i;
			}
		}
		if (far > 0) {
			keep[far] = 1;
			stack.push([first, far], [far, last]);
		}
	}
	return points.filter((_, i) => keep[i]);
}

/**
 * SVG path data for a set of filled shapes. Every outline is turned the same
 * way so overlapping strokes merge under the default fill rule. Shapes listed
 * in `holes` are turned the other way and cut out instead.
 */
export function toPath(shapes: Pt[][], holes: Pt[][] = []): string {
	const turn = (shape: Pt[], positive: boolean) => ((winding(shape) > 0) === positive ? shape : [...shape].reverse());
	const draw = (shape: Pt[]) => `M${simplify(shape, 0.06).map(([x, y]) => `${num(x)} ${num(y)}`).join('L')}Z`;
	return [...shapes.map((s) => draw(turn(s, true))), ...holes.map((s) => draw(turn(s, false)))].join('');
}

/** An ornament: its drawing box and its path data. */
export interface Ornament {
	width: number;
	height: number;
	d: string;
}

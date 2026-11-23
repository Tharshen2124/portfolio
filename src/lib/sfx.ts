/**
 * The game design's interface sounds, kept soft like a game's menus: a light
 * tick when the pointer or the keyboard moves onto something, and a press when
 * a link or button is clicked, tapped or followed with Enter.
 *
 * They play through Web Audio, so a sound starts the instant it's asked for and
 * a quick run along a menu doesn't pile sounds up. Browsers only allow sound
 * after a click, tap or key press, so nothing plays before the first one.
 * They're quiet whenever the music toggle is off (Music.astro), and the original
 * design has none.
 */
// Imported rather than kept in public/, so the files are fingerprinted and cached for good.
import hoverUrl from '../assets/sfx/hover.mp3?url';
import clickUrl from '../assets/sfx/click.mp3?url';

/** Gain for each sound, well under the music's. */
const HOVER_VOLUME = 0.12;
const CLICK_VOLUME = 0.1;

interface Cut {
	/** Where in the file to start, skipping its lead-in. */
	from: number;
	/** How long to play before it's faded out, cutting its long tail. */
	length: number;
	/** How long the fade out at the end takes. */
	fade: number;
}

const HOVER_CUT: Cut = { from: 0.04, length: 0.4, fade: 0.12 };
const CLICK_CUT: Cut = { from: 0, length: 0.6, fade: 0.2 };

/** Moving faster than this between items plays one tick, not a burst of them. */
const HOVER_GAP = 45;
/** A tap focuses as it lands, which isn't a hover, so ticks wait this long after one. */
const TOUCH_QUIET = 800;

const PREF = 'game-music';
const muted = () => {
	try {
		return localStorage.getItem(PREF) === 'off';
	} catch {
		return false;
	}
};

let context: AudioContext | undefined;
const buffers: { hover?: AudioBuffer; click?: AudioBuffer } = {};

// Decoded straight away with an offline context, which needs no press, so the
// first sound is ready the moment the browser allows it.
const load = async () => {
	const decoder = new OfflineAudioContext(1, 1, 44100);
	const decode = async (url: string) => decoder.decodeAudioData(await (await fetch(url)).arrayBuffer());
	try {
		[buffers.hover, buffers.click] = await Promise.all([decode(hoverUrl), decode(clickUrl)]);
	} catch {
		// Not loaded or not decodable: the site just stays quiet.
	}
};

// The context is made on the first press, as browsers want, and resumed on
// later ones if it was suspended.
const unlock = () => {
	pressed = true;
	try {
		context ??= new AudioContext();
		if (context.state !== 'running') void context.resume();
	} catch {
		// No Web Audio: no sounds.
	}
};

let pressed = false;
let playingHover: { source: AudioBufferSourceNode; gain: GainNode } | undefined;
let lastHover = 0;
let lastTouch = -Infinity;

const start = (context: AudioContext, buffer: AudioBuffer, volume: number, cut: Cut) => {
	const now = context.currentTime;
	const length = Math.min(cut.length, buffer.duration - cut.from);
	const source = context.createBufferSource();
	const gain = context.createGain();
	source.buffer = buffer;
	gain.gain.setValueAtTime(volume, now);
	gain.gain.setValueAtTime(volume, now + length - cut.fade);
	gain.gain.linearRampToValueAtTime(0, now + length);
	source.connect(gain).connect(context.destination);
	source.start(now, cut.from, length);
	return { source, gain };
};

const play = async (buffer: AudioBuffer | undefined, volume: number, cut: Cut) => {
	if (!context || !buffer || muted() || document.hidden) return;
	// The press that makes the context can come with the first sound, before it's
	// running. Until there's been a press, waiting would only save the sounds
	// up to burst out together later.
	if (context.state !== 'running') {
		if (!pressed) return;
		try {
			await context.resume();
		} catch {
			return;
		}
	}
	return start(context, buffer, volume, cut);
};

/** The tick for the pointer or the keyboard landing on something. */
export const hover = () => {
	const now = performance.now();
	if (now - lastHover < HOVER_GAP || now - lastTouch < TOUCH_QUIET) return;
	lastHover = now;
	// A new tick cuts the last one short rather than ringing over it.
	if (playingHover && context) {
		const { source, gain } = playingHover;
		const t = context.currentTime;
		gain.gain.cancelScheduledValues(t);
		gain.gain.setValueAtTime(gain.gain.value, t);
		gain.gain.linearRampToValueAtTime(0, t + 0.03);
		source.stop(t + 0.03);
	}
	playingHover = undefined;
	void play(buffers.hover, HOVER_VOLUME, HOVER_CUT).then((playing) => (playingHover = playing));
};

/** The press for a link or button being followed. */
export const click = () => {
	void play(buffers.click, CLICK_VOLUME, CLICK_CUT);
};

/** What a sound belongs to: a whole menu item, or a lone link or button. */
const targetOf = (node: EventTarget | null) => {
	if (!(node instanceof Element)) return null;
	return node.closest<HTMLElement>('[data-item]') ?? node.closest<HTMLElement>('a[href], button');
};

let underPointer: HTMLElement | null = null;
let underFocus: HTMLElement | null = null;

export const install = () => {
	for (const type of ['pointerdown', 'pointerup', 'click', 'touchend', 'keydown']) {
		document.addEventListener(type, unlock, { capture: true, passive: true });
	}

	document.addEventListener(
		'pointerdown',
		(event) => {
			if (event.pointerType !== 'mouse') lastTouch = performance.now();
		},
		{ capture: true, passive: true },
	);

	// The mouse moving onto an item or link. Touch has no hover, so it's left out.
	document.addEventListener('pointerover', (event) => {
		if (event.pointerType !== 'mouse') return;
		const target = targetOf(event.target);
		if (target && target !== underPointer) hover();
		underPointer = target;
	});
	document.addEventListener('pointerout', (event) => {
		if (underPointer && !underPointer.contains(event.relatedTarget as Node | null)) underPointer = null;
	});

	// The arrow keys or Tab moving the focus. A click focuses what it lands on
	// too, but only keyboard focus is :focus-visible.
	document.addEventListener('focusin', (event) => {
		const target = targetOf(event.target);
		if (!target || target === underFocus) return;
		underFocus = target;
		if ((event.target as Element).matches(':focus-visible')) hover();
	});
	document.addEventListener('focusout', (event) => {
		if (underFocus && !underFocus.contains(event.relatedTarget as Node | null)) underFocus = null;
	});

	// Clicks, taps and Enter on links and buttons, including the ones the arrow
	// keys press for the neighbouring screens.
	document.addEventListener(
		'click',
		(event) => {
			if (event.button === 0 && (event.target as Element).closest?.('a[href], button')) click();
		},
		{ capture: true },
	);

	// Small files, fetched once the page has settled.
	if ('requestIdleCallback' in window) requestIdleCallback(() => void load());
	else setTimeout(() => void load(), 1000);
};

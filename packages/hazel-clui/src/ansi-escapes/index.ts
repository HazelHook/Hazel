import process from 'node:process';

/* eslint-disable @typescript-eslint/member-ordering */
import type {Buffer} from 'node:buffer';
import type {LiteralUnion} from 'type-fest';

export type ImageOptions = {
	/**
	The width is given as a number followed by a unit, or the word `'auto'`.

	- `N`: N character cells.
	- `Npx`: N pixels.
	- `N%`: N percent of the session's width or height.
	- `auto`: The image's inherent size will be used to determine an appropriate dimension.
	*/
	readonly width?: LiteralUnion<'auto', number | string>;

	/**
	The height is given as a number followed by a unit, or the word `'auto'`.

	- `N`: N character cells.
	- `Npx`: N pixels.
	- `N%`: N percent of the session's width or height.
	- `auto`: The image's inherent size will be used to determine an appropriate dimension.
	*/
	readonly height?: LiteralUnion<'auto', number | string>;

	/**
	@default true
	*/
	readonly preserveAspectRatio?: boolean;
};

export type AnnotationOptions = {
	/**
	Nonzero number of columns to annotate.

	Default: The remainder of the line.
	*/
	readonly length?: number;

	/**
	Starting X coordinate.

	Must be used with `y` and `length`.

	Default: The cursor position
	*/
	readonly x?: number;

	/**
	Starting Y coordinate.

	Must be used with `x` and `length`.

	Default: Cursor position.
	*/
	readonly y?: number;

	/**
	Create a "hidden" annotation.

	Annotations created this way can be shown using the "Show Annotations" iTerm command.
	*/
	readonly isHidden?: boolean;
};

type ansiEscapes = {
	/**
	Set the absolute position of the cursor. `x0` `y0` is the top left of the screen.
	*/
	cursorTo(x: number, y?: number): string;

	/**
	Set the position of the cursor relative to its current position.
	*/
	cursorMove(x: number, y?: number): string;

	/**
	Move cursor up a specific amount of rows.

	@param count - Count of rows to move up. Default is `1`.
	*/
	cursorUp(count?: number): string;

	/**
	Move cursor down a specific amount of rows.

	@param count - Count of rows to move down. Default is `1`.
	*/
	cursorDown(count?: number): string;

	/**
	Move cursor forward a specific amount of rows.

	@param count - Count of rows to move forward. Default is `1`.
	*/
	cursorForward(count?: number): string;

	/**
	Move cursor backward a specific amount of rows.

	@param count - Count of rows to move backward. Default is `1`.
	*/
	cursorBackward(count?: number): string;

	/**
	Move cursor to the left side.
	*/
	cursorLeft: string;

	/**
	Save cursor position.
	*/
	cursorSavePosition: string;

	/**
	Restore saved cursor position.
	*/
	cursorRestorePosition: string;

	/**
	Get cursor position.
	*/
	cursorGetPosition: string;

	/**
	Move cursor to the next line.
	*/
	cursorNextLine: string;

	/**
	Move cursor to the previous line.
	*/
	cursorPrevLine: string;

	/**
	Hide cursor.
	*/
	cursorHide: string;

	/**
	Show cursor.
	*/
	cursorShow: string;

	/**
	Erase from the current cursor position up the specified amount of rows.

	@param count - Count of rows to erase.
	*/
	eraseLines(count: number): string;

	/**
	Erase from the current cursor position to the end of the current line.
	*/
	eraseEndLine: string;

	/**
	Erase from the current cursor position to the start of the current line.
	*/
	eraseStartLine: string;

	/**
	Erase the entire current line.
	*/
	eraseLine: string;

	/**
	Erase the screen from the current line down to the bottom of the screen.
	*/
	eraseDown: string;

	/**
	Erase the screen from the current line up to the top of the screen.
	*/
	eraseUp: string;

	/**
	Erase the screen and move the cursor the top left position.
	*/
	eraseScreen: string;

	/**
	Scroll display up one line.
	*/
	scrollUp: string;

	/**
	Scroll display down one line.
	*/
	scrollDown: string;

	/**
	Clear the terminal screen. (Viewport)
	*/
	clearScreen: string;

	/**
	Clear the whole terminal, including scrollback buffer. (Not just the visible part of it)
	*/
	clearTerminal: string;

	/**
	Enter the [alternative screen](https://terminalguide.namepad.de/mode/p47/).
	*/
	enterAlternativeScreen: string;

	/**
	Exit the [alternative screen](https://terminalguide.namepad.de/mode/p47/), assuming `enterAlternativeScreen` was called before.
	*/
	exitAlternativeScreen: string;

	/**
	Output a beeping sound.
	*/
	beep: string;

	/**
	Create a clickable link.

	[Supported terminals.](https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda) Use [`supports-hyperlinks`](https://github.com/jamestalmage/supports-hyperlinks) to detect link support.
	*/
	link(text: string, url: string): string;

	/**
	Display an image.

	_Currently only supported on iTerm2 >=3_

	See [term-img](https://github.com/sindresorhus/term-img) for a higher-level module.

	@param buffer - Buffer of an image. Usually read in with `fs.readFile()`.
	*/
	image(buffer: Buffer, options?: ImageOptions): string;

	iTerm: {
		/**
		[Inform iTerm2](https://www.iterm2.com/documentation-escape-codes.html) of the current directory to help semantic history and enable [Cmd-clicking relative paths](https://coderwall.com/p/b7e82q/quickly-open-files-in-iterm-with-cmd-click).

		@param cwd - Current directory. Default: `process.cwd()`.
		*/
		setCwd(cwd?: string): string;

		/**
		An annotation looks like this when shown:

		![screenshot of iTerm annotation](https://user-images.githubusercontent.com/924465/64382136-b60ac700-cfe9-11e9-8a35-9682e8dc4b72.png)

		See the [iTerm Proprietary Escape Codes documentation](https://iterm2.com/documentation-escape-codes.html) for more information.

		@param message - The message to display within the annotation. The `|` character is disallowed and will be stripped.
		@returns An escape code which will create an annotation when printed in iTerm2.
		*/
		annotation(message: string, options?: AnnotationOptions): string;
	};
};

const ESC = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

// const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const isBrowser = false;

const isTerminalApp = !isBrowser && process.env.TERM_PROGRAM === 'Apple_Terminal';
const isWindows = !isBrowser && process.platform === 'win32';
const cwdFunction = isBrowser ? () => {
	throw new Error('`process.cwd()` only works in Node.js, not the browser.');
} : process.cwd;

export const cursorTo = (x: number, y: number) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	if (typeof y !== 'number') {
		return ESC + (x + 1) + 'G';
	}

	return ESC + (y + 1) + SEP + (x + 1) + 'H';
};

export const cursorMove = (x: number, y: number) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	let returnValue = '';

	if (x < 0) {
		returnValue += ESC + (-x) + 'D';
	} else if (x > 0) {
		returnValue += ESC + x + 'C';
	}

	if (y < 0) {
		returnValue += ESC + (-y) + 'A';
	} else if (y > 0) {
		returnValue += ESC + y + 'B';
	}

	return returnValue;
};

export const cursorUp = (count = 1) => ESC + count + 'A';
export const cursorDown = (count = 1) => ESC + count + 'B';
export const cursorForward = (count = 1) => ESC + count + 'C';
export const cursorBackward = (count = 1) => ESC + count + 'D';

export const cursorLeft = ESC + 'G';
export const cursorSavePosition = isTerminalApp ? '\u001B7' : ESC + 's';
export const cursorRestorePosition = isTerminalApp ? '\u001B8' : ESC + 'u';
export const cursorGetPosition = ESC + '6n';
export const cursorNextLine = ESC + 'E';
export const cursorPrevLine = ESC + 'F';
export const cursorHide = ESC + '?25l';
export const cursorShow = ESC + '?25h';

export const eraseLines = (count: number) => {
	let clear = '';

	for (let i = 0; i < count; i++) {
		clear += eraseLine + (i < count - 1 ? cursorUp() : '');
	}

	if (count) {
		clear += cursorLeft;
	}

	return clear;
};

export const eraseEndLine = ESC + 'K';
export const eraseStartLine = ESC + '1K';
export const eraseLine = ESC + '2K';
export const eraseDown = ESC + 'J';
export const eraseUp = ESC + '1J';
export const eraseScreen = ESC + '2J';
export const scrollUp = ESC + 'S';
export const scrollDown = ESC + 'T';

export const clearScreen = '\u001Bc';

export const clearTerminal = isWindows
	? `${eraseScreen}${ESC}0f`
	// 1. Erases the screen (Only done in case `2` is not supported)
	// 2. Erases the whole screen including scrollback buffer
	// 3. Moves cursor to the top-left position
	// More info: https://www.real-world-systems.com/docs/ANSIcode.html
	: `${eraseScreen}${ESC}3J${ESC}H`;

export const enterAlternativeScreen = ESC + '?1049h';
export const exitAlternativeScreen = ESC + '?1049l';

export const beep = BEL;

export const link = (text: string, url: string) => [
	OSC,
	'8',
	SEP,
	SEP,
	url,
	BEL,
	text,
	OSC,
	'8',
	SEP,
	SEP,
	BEL,
].join('');

export const image = (buffer: Buffer, options: ImageOptions = {}): string => {
	let returnValue = `${OSC}1337;File=inline=1`;

	if (options.width) {
		returnValue += `;width=${options.width}`;
	}

	if (options.height) {
		returnValue += `;height=${options.height}`;
	}

	if (options.preserveAspectRatio === false) {
		returnValue += ';preserveAspectRatio=0';
	}

	return returnValue + ':' + buffer.toString('base64') + BEL;
};

export const iTerm = {
	setCwd: (cwd = cwdFunction()) => `${OSC}50;CurrentDir=${cwd}${BEL}`,

	annotation(message: string, options: AnnotationOptions = {}) {
		let returnValue = `${OSC}1337;`;

		const hasX = typeof options.x !== 'undefined';
		const hasY = typeof options.y !== 'undefined';
		if ((hasX || hasY) && !(hasX && hasY && typeof options.length !== 'undefined')) {
			throw new Error('`x`, `y` and `length` must be defined when `x` or `y` is defined');
		}

		message = message.replace(/\|/g, '');

		returnValue += options.isHidden ? 'AddHiddenAnnotation=' : 'AddAnnotation=';

		if (options.length && options.length > 0) {
			returnValue += (
				hasX
					? [message, options.length, options.x, options.y]
					: [options.length, message]
			).join('|');
		} else {
			returnValue += message;
		}

		return returnValue + BEL;
	},
};

export default ansiEscapes;
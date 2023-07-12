import stripAnsi from '../strip-ansi';
import {
	eastAsianWidth
} from '../eastasianwidth';
import emojiRegex from '../emoji-regex';

export type Options = {
	/**
	Count [ambiguous width characters](https://www.unicode.org/reports/tr11/#Ambiguous) as having narrow width (count of 1) instead of wide width (count of 2).

	@default true
	*/
	readonly ambiguousIsNarrow?: boolean;

	/**
	Whether [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) should be counted.

	@default false
	*/
	readonly countAnsiEscapeCodes?: boolean;
};
export default function stringWidth(text: string, options?: Options): number {
	if (typeof text !== 'string' || text.length === 0) {
		return 0;
	}

	options = {
		ambiguousIsNarrow: true,
		countAnsiEscapeCodes: false,
		...options,
	};

	if (!options.countAnsiEscapeCodes) {
		text = stripAnsi(text);
	}

	if (text.length === 0) {
		return 0;
	}

	const ambiguousCharacterWidth = options.ambiguousIsNarrow ? 1 : 2;
	let width = 0;

	for (const {segment: character} of new Intl.Segmenter().segment(text)) {
		const codePoint = character.codePointAt(0)!;

		// Ignore control characters
		if (codePoint <= 0x1F || (codePoint >= 0x7F && codePoint <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (codePoint >= 0x3_00 && codePoint <= 0x3_6F) {
			continue;
		}

		if (emojiRegex().test(character)) {
			width += 2;
			continue;
		}

		const code = eastAsianWidth(character);
		switch (code) {
			case 'F':
			case 'W': {
				width += 2;
				break;
			}

			case 'A': {
				width += ambiguousCharacterWidth;
				break;
			}

			default: {
				width += 1;
			}
		}
	}

	return width;
}
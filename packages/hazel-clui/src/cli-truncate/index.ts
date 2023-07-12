import sliceAnsi from '../slice-ansi';
import stringWidth from '../string-width';
interface Options {
	/**
	The position to truncate the string.

	@default 'end'
	*/
	readonly position?: 'start' | 'middle' | 'end';

	/**
	Add a space between the text and the ellipsis.

	@default false

	@example
	```
	import cliTruncate from 'cli-truncate';

	cliTruncate('unicorns', 5, {position: 'end', space: true});
	//=> 'uni …'

	cliTruncate('unicorns', 5, {position: 'end', space: false});
	//=> 'unic…'

	cliTruncate('unicorns', 6, {position: 'start', space: true});
	//=> '… orns'

	cliTruncate('unicorns', 7, {position: 'middle', space: true});
	//=> 'uni … s'
	```
	*/
	readonly space?: boolean;

	/**
	Truncate the string from a whitespace if it is within 3 characters from the actual breaking point.

	@default false

	@example
	```
	import cliTruncate from 'cli-truncate';

	cliTruncate('unicorns rainbow dragons', 20, {position: 'start', preferTruncationOnSpace: true});
	//=> '…rainbow dragons'

	cliTruncate('unicorns rainbow dragons', 20, {position: 'middle', preferTruncationOnSpace: true});
	//=> 'unicorns…dragons'

	cliTruncate('unicorns rainbow dragons', 6, {position: 'end', preferTruncationOnSpace: true});
	//=> 'unico…'
	````
	*/
	readonly preferTruncationOnSpace?: boolean;

	/**
	The character to use at the breaking point.

	@default '…'

	@example
	```
	import cliTruncate from 'cli-truncate';

	cliTruncate('unicorns', 5, {position: 'end'});
	//=> 'unic…'

	cliTruncate('unicorns', 5, {position: 'end', truncationCharacter: '.'});
	//=> 'unic.'

	cliTruncate('unicorns', 5, {position: 'end', truncationCharacter: ''});
	//=> 'unico'
	*/
	readonly truncationCharacter?: string;
}


function getIndexOfNearestSpace(text: string, wantedIndex: number, shouldSearchRight?: boolean) {
	if (text.charAt(wantedIndex) === ' ') {
		return wantedIndex;
	}

	for (let index = 1; index <= 3; index++) {
		if (shouldSearchRight) {
			if (text.charAt(wantedIndex + index) === ' ') {
				return wantedIndex + index;
			}
		} else if (text.charAt(wantedIndex - index) === ' ') {
			return wantedIndex - index;
		}
	}

	return wantedIndex;
}

export default function cliTruncate(text: string, columns: number, options: Options = {}) {
	options = {
		position: 'end',
		preferTruncationOnSpace: false,
		truncationCharacter: '…',
		...options,
	};

	const {position, space, preferTruncationOnSpace} = options;
	let truncationCharacter = options.truncationCharacter!;

	if (typeof text !== 'string') {
		throw new TypeError(`Expected \`input\` to be a string, got ${typeof text}`);
	}

	if (typeof columns !== 'number') {
		throw new TypeError(`Expected \`columns\` to be a number, got ${typeof columns}`);
	}

	if (columns < 1) {
		return '';
	}

	if (columns === 1) {
		return truncationCharacter;
	}

	const length = stringWidth(text);

	if (length <= columns) {
		return text;
	}

	if (position === 'start') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(text, length - columns + 1, true);
			return truncationCharacter + sliceAnsi(text, nearestSpace, length).trim();
		}

		if (space === true) {
			truncationCharacter += ' ';
		}

		return truncationCharacter + sliceAnsi(text, length - columns + stringWidth(truncationCharacter), length);
	}

	if (position === 'middle') {
		if (space === true) {
			truncationCharacter = ` ${truncationCharacter} `;
		}

		const half = Math.floor(columns / 2);

		if (preferTruncationOnSpace) {
			const spaceNearFirstBreakPoint = getIndexOfNearestSpace(text, half);
			const spaceNearSecondBreakPoint = getIndexOfNearestSpace(text, length - (columns - half) + 1, true);
			return sliceAnsi(text, 0, spaceNearFirstBreakPoint) + truncationCharacter + sliceAnsi(text, spaceNearSecondBreakPoint, length).trim();
		}

		return (
			sliceAnsi(text, 0, half)
				+ truncationCharacter
				+ sliceAnsi(text, length - (columns - half) + stringWidth(truncationCharacter), length)
		);
	}

	if (position === 'end') {
		if (preferTruncationOnSpace) {
			const nearestSpace = getIndexOfNearestSpace(text, columns - 1);
			return sliceAnsi(text, 0, nearestSpace) + truncationCharacter;
		}

		if (space === true) {
			truncationCharacter = ` ${truncationCharacter}`;
		}

		return sliceAnsi(text, 0, columns - stringWidth(truncationCharacter)) + truncationCharacter;
	}

	throw new Error(`Expected \`options.position\` to be either \`start\`, \`middle\` or \`end\`, got ${position}`);
}
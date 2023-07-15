import ansiStyles from "ansi-styles"

import stringWidth from "../string-width"
import stripAnsi from "../strip-ansi"

const ESCAPES = new Set(["\u001B", "\u009B"])

const END_CODE = 39
const ANSI_ESCAPE_BELL = "\u0007"
const ANSI_CSI = "["
const ANSI_OSC = "]"
const ANSI_SGR_TERMINATOR = "m"
const ANSI_ESCAPE_LINK = `${ANSI_OSC}8;;`

const wrapAnsiCode = (code: number) => `${ESCAPES.values().next().value}${ANSI_CSI}${code}${ANSI_SGR_TERMINATOR}`
const wrapAnsiHyperlink = (uri: string) =>
	`${ESCAPES.values().next().value}${ANSI_ESCAPE_LINK}${uri}${ANSI_ESCAPE_BELL}`

// Calculate the length of words split on ' ', ignoring
// the extra characters added by ansi escape codes
const wordLengths = (text: string) => text.split(" ").map((character) => stringWidth(character))

// Wrap a long word across multiple rows
// Ansi escape codes do not count towards length
const wrapWord = (rows: string[], word: string, columns: number) => {
	const characters = [...word]

	let isInsideEscape = false
	let isInsideLinkEscape = false
	let visible = stringWidth(stripAnsi(rows[rows.length - 1]))

	for (const [index, character] of characters.entries()) {
		const characterLength = stringWidth(character)

		if (visible + characterLength <= columns) {
			rows[rows.length - 1] += character
		} else {
			rows.push(character)
			visible = 0
		}

		if (ESCAPES.has(character)) {
			isInsideEscape = true
			isInsideLinkEscape = characters
				.slice(index + 1)
				.join("")
				.startsWith(ANSI_ESCAPE_LINK)
		}

		if (isInsideEscape) {
			if (isInsideLinkEscape) {
				if (character === ANSI_ESCAPE_BELL) {
					isInsideEscape = false
					isInsideLinkEscape = false
				}
			} else if (character === ANSI_SGR_TERMINATOR) {
				isInsideEscape = false
			}

			continue
		}

		visible += characterLength

		if (visible === columns && index < characters.length - 1) {
			rows.push("")
			visible = 0
		}
	}

	// It's possible that the last row we copy over is only
	// ansi escape characters, handle this edge-case
	if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
		rows[rows.length - 2] += rows.pop()
	}
}

// Trims spaces from a string ignoring invisible sequences
const stringVisibleTrimSpacesRight = (text: string) => {
	const words = text.split(" ")
	let last = words.length

	while (last > 0) {
		if (stringWidth(words[last - 1]) > 0) {
			break
		}

		last--
	}

	if (last === words.length) {
		return text
	}

	return words.slice(0, last).join(" ") + words.slice(last).join("")
}

// The wrap-ansi module can be invoked in either 'hard' or 'soft' wrap mode
//
// 'hard' will never allow a string to take up more than columns characters
//
// 'soft' allows long words to expand past the column length
const exec = (string: string, columns: number, options: Options = {}) => {
	if (options.trim !== false && string.trim() === "") {
		return ""
	}

	let returnValue = ""
	let escapeCode
	let escapeUrl

	const lengths = wordLengths(string)
	let rows = [""]

	for (const [index, word] of string.split(" ").entries()) {
		if (options.trim !== false) {
			rows[rows.length - 1] = rows[rows.length - 1].trimStart()
		}

		let rowLength = stringWidth(rows[rows.length - 1])

		if (index !== 0) {
			if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
				// If we start with a new word but the current row length equals the length of the columns, add a new row
				rows.push("")
				rowLength = 0
			}

			if (rowLength > 0 || options.trim === false) {
				rows[rows.length - 1] += " "
				rowLength++
			}
		}

		// In 'hard' wrap mode, the length of a line is never allowed to extend past 'columns'
		if (options.hard && lengths[index] > columns) {
			const remainingColumns = columns - rowLength
			const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns)
			const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns)
			if (breaksStartingNextLine < breaksStartingThisLine) {
				rows.push("")
			}

			wrapWord(rows, word, columns)
			continue
		}

		if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
			if (options.wordWrap === false && rowLength < columns) {
				wrapWord(rows, word, columns)
				continue
			}

			rows.push("")
		}

		if (rowLength + lengths[index] > columns && options.wordWrap === false) {
			wrapWord(rows, word, columns)
			continue
		}

		rows[rows.length - 1] += word
	}

	if (options.trim !== false) {
		rows = rows.map((row) => stringVisibleTrimSpacesRight(row))
	}

	const pre = [...rows.join("\n")]

	for (const [index, character] of pre.entries()) {
		returnValue += character

		if (ESCAPES.has(character)) {
			const regex = new RegExp(
				`(?:\\${ANSI_CSI}(?<code>\\d+)m|\\${ANSI_ESCAPE_LINK}(?<uri>.*)${ANSI_ESCAPE_BELL})`,
			).exec(pre.slice(index).join(""))
			if (regex?.groups?.code !== undefined) {
				const code = Number.parseFloat(regex.groups.code)
				escapeCode = code === END_CODE ? undefined : code
			} else if (regex?.groups?.uri !== undefined) {
				escapeUrl = regex.groups.uri.length === 0 ? undefined : regex.groups.uri
			}
		}

		const code = ansiStyles.codes.get(Number(escapeCode))

		if (pre[index + 1] === "\n") {
			if (escapeUrl) {
				returnValue += wrapAnsiHyperlink("")
			}

			if (escapeCode && code) {
				returnValue += wrapAnsiCode(code)
			}
		} else if (character === "\n") {
			if (escapeCode && code) {
				returnValue += wrapAnsiCode(escapeCode)
			}

			if (escapeUrl) {
				returnValue += wrapAnsiHyperlink(escapeUrl)
			}
		}
	}

	return returnValue
}
type Options = {
	/**
	By default the wrap is soft, meaning long words may extend past the column width. Setting this to `true` will make it hard wrap at the column width.

	@default false
	*/
	readonly hard?: boolean

	/**
	By default, an attempt is made to split words at spaces, ensuring that they don't extend past the configured columns. If wordWrap is `false`, each column will instead be completely filled splitting words as necessary.

	@default true
	*/
	readonly wordWrap?: boolean

	/**
	Whitespace on all lines is removed by default. Set this option to `false` if you don't want to trim.

	@default true
	*/
	readonly trim?: boolean
}

// For each newline, invoke the method separately
export default function wrapAnsi(text: string, columns: number, options?: Options): string {
	return String(text)
		.normalize()
		.replace(/\r\n/g, "\n")
		.split("\n")
		.map((line) => exec(line, columns, options))
		.join("\n")
}

import ansiRegex from "../ansi-regex"

const regex = ansiRegex()

export default function stripAnsi(text: string) {
	if (typeof text !== "string") {
		throw new TypeError(`Expected a \`string\`, got \`${typeof text}\``)
	}

	// Even though the regex is global, we don't need to reset the `.lastIndex`
	// because unlike `.exec()` and `.test()`, `.replace()` does it automatically
	// and doing it manually has a performance penalty.
	return text.replace(regex, "")
}

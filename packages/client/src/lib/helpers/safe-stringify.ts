export function safeStringify(
	obj: any,
	replacer?: (key: string, value: any) => any,
	spaces?: number | string,
	cycleReplacer?: (key: string, value: any) => any,
): string {
	return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(
	replacer?: (this: any, key: string, value: any) => any,
	cycleReplacer?: (key: string, value: any) => any,
): (key: string, value: any) => any {
	const stack: any[] = []
	const keys: string[] = []

	const defaultCycleReplacer = (key: string, value: any): string => {
		const position = stack.indexOf(value)
		const circularReferencePath = position >= 0 ? keys.slice(0, position).join(".") : ""
		return `[Circular ~${circularReferencePath ? `.${circularReferencePath}` : ""}]`
	}

	const actualCycleReplacer = cycleReplacer ?? defaultCycleReplacer

	return function (this: any, key: string, value: any): any {
		let resultValue = value

		const stackIndex = stack.indexOf(this)
		if (stackIndex === -1) {
			stack.push(this)
			keys.push(key)
		} else {
			stack.splice(stackIndex + 1)
			keys.splice(stackIndex, Infinity, key)
		}

		if (stack.includes(resultValue)) {
			resultValue = actualCycleReplacer.call(this, key, resultValue)
		} else if (stack.length === 1) {
			stack.push(resultValue)
		}

		return replacer ? replacer.call(this, key, resultValue) : resultValue
	}
}

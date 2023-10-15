export function getCookie(name: string) {
	const cookieDict = document.cookie
		.split(";")
		.map((x) => x.split("="))
		.reduce((accum, current) => {
			accum[current[0].trim()] = current[1]
			return accum
		}, Object())

	return cookieDict[name]
}

export function setCookie(name: string, value: string) {
	document.cookie = `${name}=${value}; Path=/`
}

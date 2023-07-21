import portfinder from "portfinder"
import { exec } from "child_process"
import clipboard from "clipboardy"

export const getUnusedPort = async () => {
	try {
		return await new Promise((resolve, reject) => {
			portfinder.getPorts(
				1,
				{
					host: "localhost",
					// 38204 - 38799 are widely unused ports. We need to hardcode ports because the callback URL of OAuth2 is fixed.
					port: 38404,
					stopPort: 38414,
				},
				(err, ports) => {
					if (err) {
						reject(err)
					} else {
						resolve(ports[0])
					}
				},
			)
		})
	} catch (e) {
		console.error(e)
		throw new Error("Failed to find unused port. Please free a port in range 38404:38414.")
	}
}

export function openInBrowser(url: string) {
	exec(`open "${url}"`)
}

export function copyToClipboard(text: string) {
	clipboard.writeSync(text)
}

export function maxStringLength(element: string[]) {
	let max = 0
	for (const e of element) {
		if (e.length > max) {
			max = e.length
		}
	}
	return max
}
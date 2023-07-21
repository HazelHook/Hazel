import React, { useEffect, useState } from "react"
import { rand, randBetweenDate, randJSON, randNumber, randText, randUrl, randWord } from "@ngneat/falso"
import figures from "figures"
import { nanoid } from "nanoid"

import { Tiny } from "../../../db/src/tinybird/index.js"
import { Box, measureElement, Newline, Text, useInput } from "../ext/ink"
import { ProgressBar } from "../ext/ink-progress-bar"
import TextInput from "../ext/ink-text-input"
import { useDataSources } from "../lib/datasource"

function generateIds(numberOfIds: number, prefix: string) {
	const ids = []
	for (let i = 0; i < numberOfIds; i++) {
		ids.push(`${prefix}_${nanoid()}`)
	}
	return ids
}

function generateContent() {
	const ids = rand([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
	let content_type = ""
	let content = ""

	if (ids > 6) {
		content_type = "application/json"
		content = JSON.stringify(randJSON({ minKeys: 1, maxKeys: 20 }))
	} else if (ids > 3) {
		content_type = "application/xml"
		// content = js2xmlparser.parse("root", randJSON({ minKeys: 1, maxKeys: 20, }))
		content = `<root>${randText({
			charCount: randNumber({ min: 10, max: 1000 }),
		})}</root>`
	} else if (ids > 1) {
		content_type = "text/plain"
		content = randText({ charCount: randNumber({ min: 10, max: 1000 }) })
	} else {
		return {
			headers: "{}",
			body: "{}",
		}
	}

	return {
		headers: JSON.stringify({
			"Content-Type": content_type,
			"Content-Length": content.length,
			"User-Agent": rand([
				"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
				"Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36",
				"Mozilla/5.0 (Linux; Android 10; Google Pixel 4 Build/QD1A.190821.014.C2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 Mobile Safari/537.36",
				"Mozilla/5.0 (Linux; Android 9; J8110 Build/55.0.A.0.552; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36",
				"Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1",
			]),
			Accept: rand([
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
				"application/json",
				"application/xml",
				"text/plain",
			]),
		}),
		body: content,
	}
}

function generateSuccessState() {
	const status = rand([200, 201, 400, 401, 403, 404, 424, 500, 503])
	return {
		status,
		success: status < 400,
	}
}

export function Planter({
	mode,
	selected,
	engaged,
}: {
	mode: "details" | "select"
	selected?: boolean
	engaged?: boolean
}) {
	const [customerId, setCustomerId] = useState("")
	const [sources, setSources] = useState("")
	const [destinations, setDestinations] = useState("")
	const [numberOfRequests, setNumberOfRequests] = useState("")
	const [connections, setConnections] = useState("")
	const [dataSources, setDataSources] = useDataSources()
	const [selectedInput, setSelectedInput] = useState(0)

	const [progress, setProgress] = useState({
		percentage: 1.0,
		width: 0,
	})
	const progressRef = React.useRef<any>()
	useEffect(() => {
		if (progressRef.current) {
			const size = measureElement(progressRef.current)
			setProgress({
				percentage: progress.percentage,
				width: size.width - 6,
			})
		}
	}, [progressRef.current])

	useInput(async (input, key) => {
		if (engaged) {
			if (key.upArrow) {
				let newOption = selectedInput - 1
				if (newOption < 0) newOption = 5

				setSelectedInput(newOption)
			}

			if (key.downArrow) {
				let newOption = selectedInput + 1
				if (newOption >= 6) newOption = 0

				setSelectedInput(newOption)
			}

			if (key.return) {
				const tb = Tiny(process.env.TINY_TOKEN!)

				const generatedSourceIds = generateIds(parseInt(sources), "src")
				const generatedDestinationIds = generateIds(parseInt(destinations), "dst")
				const generatedConnectionIds = generateIds(parseInt(connections), "conn")
				const generatedRequestIds = generateIds(parseInt(numberOfRequests), "req")

				const totalElements =
					generatedSourceIds.length +
					generatedDestinationIds.length +
					generatedConnectionIds.length +
					generatedRequestIds.length * 2
				let processedElements = 0

				setProgress({
					percentage: 0.0,
					width: progress.width,
				})

				const db = dataSources.db

				const sourceObjects: any[] = []
				await db.transaction(async (tx) => {
					for (let i = 0; i < generatedSourceIds.length; i++) {
						const sourceObject = await tx.insert(sources).values({
							name: `${randWord({ capitalize: true })}`,
							publicId: generatedSourceIds[i],
							customerId,

							url: "http://127.0.0.1:8787/",
						})
						sourceObjects.push(sourceObject)
					}
				})
				processedElements += generatedSourceIds.length
				setProgress({
					percentage: processedElements / totalElements,
					width: progress.width,
				})

				const destinationObjects: any[] = []
				await db.transaction(async (tx) => {
					for (let i = 0; i < generatedDestinationIds.length; i++) {
						const destinationObject = await tx.insert(destinations).values({
							name: `${randWord({ capitalize: true })}`,
							publicId: generatedDestinationIds[i],
							customerId,

							url: randUrl(),
						})
						destinationObjects.push(destinationObject)
					}
				})
				processedElements += generatedDestinationIds.length

				setProgress({
					percentage: processedElements / totalElements,
					width: progress.width,
				})

				await db.transaction(async (tx) => {
					for (let i = 0; i < generatedConnectionIds.length; i++) {
						await tx.insert(connections).values({
							name: randWord({ capitalize: true }),
							customerId: customerId,
							publicId: generatedConnectionIds[i],

							sourceId: sourceObjects[i % sourceObjects.length].insertId,
							destinationId: destinationObjects[i % destinationObjects.length].insertId,
						})
					}
				})
				processedElements += generatedConnectionIds.length
				setProgress({
					percentage: processedElements / totalElements,
					width: progress.width,
				})

				const promises = []

				for (let i = 0; i < parseInt(numberOfRequests); i++) {
					let content = generateContent()

					const timestamp = randBetweenDate({
						from: new Date("01/04/2023"),
						to: new Date(),
					}).toISOString()

					promises.push(
						tb.requests.publish({
							workspace_id: customerId,
							source_id: generatedSourceIds[i % generatedSourceIds.length],
							request_id: generatedRequestIds[i],
							version: "1.0",
							timestamp,
							body: content.body,
							headers: content.headers,
						}),
					)
					content = generateContent()
					const { status, success } = generateSuccessState()

					promises.push(
						tb.responses.publish({
							workspace_id: customerId,
							source_id: generatedSourceIds[i % generatedSourceIds.length],
							destination_id: generatedDestinationIds[i % generatedDestinationIds.length],
							request_id: generatedRequestIds[i],
							body: content.body,
							headers: content.headers,
							status,
							success: success ? 1 : 0,
							version: "1.0",
							timestamp: randBetweenDate({
								from: new Date(timestamp),
								to: new Date(new Date(timestamp).getTime() + 1000),
							}).toISOString(),
						}),
					)
				}

				await Promise.all(promises)

				setProgress({
					percentage: 1.0,
					width: progress.width,
				})
			}
		}
	})

	if (mode === "details") {
		if (!selected) return null

		return (
			<Box display="flex" flexDirection="column" ref={progressRef}>
				<Box>
					<Box marginRight={1}>
						<Text>CoustomerId: </Text>
					</Box>
					<TextInput value={customerId} onChange={setCustomerId} focus={selectedInput === 0 && engaged} />
				</Box>
				<Newline />
				<Box>
					<Box marginRight={1}>
						<Text>Number of sources: </Text>
					</Box>
					<TextInput showCursor value={sources} onChange={setSources} focus={selectedInput === 1 && engaged} />
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text>Number of destinations: </Text>
					</Box>
					<TextInput value={destinations} onChange={setDestinations} focus={selectedInput === 2 && engaged} />
				</Box>
				<Box>
					<Box marginRight={1}>
						<Text>Number of connections: </Text>
					</Box>
					<TextInput value={connections} onChange={setConnections} focus={selectedInput === 3 && engaged} />
				</Box>
				<Newline />
				<Box>
					<Box marginRight={1}>
						<Text>Number of requests: </Text>
					</Box>
					<TextInput value={numberOfRequests} onChange={setNumberOfRequests} focus={selectedInput === 4 && engaged} />
				</Box>
				<ProgressBar percent={progress.percentage} columns={progress.width} />
			</Box>
		)
	}

	if (selected) {
		return (
			<Text bold color="#CC671B" dimColor={engaged}>
				{">"} Hazelnut Planter
			</Text>
		)
	}
	return (
		<Text color="#CC671B" dimColor>
			{" "}
			Hazelnut Planter
		</Text>
	)
}

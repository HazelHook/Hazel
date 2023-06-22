import React, { useState } from "react"
import { Box, Text, Newline, useInput } from "ink"
import TextInput from "ink-text-input"
import { Tiny } from "../../../db/src/tinybird/index.js"
import { connection, destination, source } from "../../../db/src/schema.js"
import { connectWDB } from "../../../db/src/index.js"
import { randBetweenDate, rand, randJSON, randText, randNumber, randWord, randUrl } from "@ngneat/falso"
import js2xmlparser from "js2xmlparser"
import fetch from "node-fetch"


const cDb = (input: {
	host: string
	username: string
	password: string
}) => {
	return connectWDB({ ...input, fetch })
}


function generateIds(numberOfIds: number, prefix: string) {
	const ids = []
	for (let i = 0; i < numberOfIds; i++) {
		ids.push(`${prefix}_${i}`)
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
		content = js2xmlparser.parse("root", randJSON({ minKeys: 1, maxKeys: 20 }))
	} else if (ids > 1) {
		content_type = "text/plain"
		content = randText({ charCount: randNumber({ min: 10, max: 1000 }) })
	}else {
		return {
			headers: '{}',
			body: '{}',			
		}
	}

	return {
		headers: JSON.stringify({
			"Content-Type": content_type,
			"Content-Length": content.length,
			"User-Agent": rand(["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36", "Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36"]),
			"Accept": rand(["text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8"]),
		}),
		body: content,
	}
}

function generateSuccessState(){
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
}: { mode: "details" | "select"; selected?: boolean; engaged?: boolean }) {
	const [customerId, setCustomerId] = useState("")
	const [sources, setSources] = useState("")
	const [destinations, setDestinations] = useState("")
	const [numberOfRequests, setNumberOfRequests] = useState("")
	const [connections, setConnections] = useState("")

	const [selectedInput, setSelectedInput] = useState(0)

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
				const  tb = Tiny(process.env.TINY_TOKEN!)

				const generatedSourceIds = generateIds(parseInt(sources), "src")
				const generatedDestinationIds = generateIds(parseInt(destinations), "dst")
				const generatedConnectionIds = generateIds(parseInt(connections), "conn")


				const db = cDb({
					username: process.env.PLANETSCALE_DB_USERNAME!,
					password: process.env.PLANETSCALE_DB_PASSWORD!,
					host: process.env.PLANETSCALE_DB_HOST!,
				})

				const sourceObjects: any[] = []
				
				for (let i = 0; i < generatedSourceIds.length; i++) {
					const sourceObject = await db.transaction(async (tx) => {
						const sourceRes = await tx.insert(source).values({
							name: `${randWord({ capitalize: true })}`,
							publicId: generatedSourceIds[i],
							customerId,
			
							url: "http://127.0.0.1:3000/",
						})
					})

					sourceObjects.push(sourceObject)
				}

				const destinationObjects: any[] = []
				for (let i = 0; i < generatedDestinationIds.length; i++) {
					const destinationObject = await db.transaction(async (tx) => {
						const destinationRes = await tx.insert(destination).values({
							name: `${randWord({ capitalize: true })}`,
							publicId: generatedDestinationIds[i],
							customerId,
			
							url: randUrl()
						})

					})

					destinationObjects.push(destinationObject)
				}

				
				for (let i = 0; i < generatedConnectionIds.length; i++) {
					const sourceId = generatedSourceIds[i % generatedSourceIds.length]
					const destinationId = generatedDestinationIds[i % generatedDestinationIds.length]

					await db.transaction(async (tx) => {
						await tx.insert(connection).values({
							name: randWord({ capitalize: true }),
							customerId: customerId,
							publicId: generatedConnectionIds[i],
							
							sourceId: sourceObjects[i % sourceObjects.length].inertId,
							destinationId: destinationObjects[i % destinationObjects.length].inertId,
						})
					})
				}
			

				const generatedRequestIds = generateIds(parseInt(numberOfRequests), "req")

				for (let i = 0; i < parseInt(numberOfRequests); i++) {
					let content = generateContent()

					const timestamp = randBetweenDate({ from: new Date("01/04/2023"), to: new Date() }).toISOString()

					tb.publishRequestEvent({
						customer_id: customerId,
						source_id: generatedSourceIds[i % generatedSourceIds.length],
						request_id: generatedRequestIds[i],
						version: "1",
						timestamp,
						body: content.body,
						headers: content.headers,
					})

					content = generateContent()
					const { status, success } = generateSuccessState()

					tb.publishResponseEvent({
						customer_id: customerId,
						source_id: generatedSourceIds[i % generatedSourceIds.length],
						destination_id: generatedDestinationIds[i % generatedDestinationIds.length],
						request_id: generatedRequestIds[i],
						body: content.body,
						headers: content.headers,
						status,
						success: success ? 1 : 0,
						version: "1",
						timestamp: randBetweenDate({
							from: new Date(timestamp),
							to: new Date(timestamp + 1000)
						}).toISOString(),
					})
				}
			}
		}
	})

	if (mode === "details") {
		if (!selected) return null

		return (
			<Box display="flex" flexDirection="column">
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
			</Box>
		)
	}

	if (selected) {
		return (
			<Text bold color="#CC671B">
				{">"} Hazelnut Planter
			</Text>
		)
	}
	return (
		<Text color="#CC671B" dimColor>
			{"  "}Hazelnut Planter
		</Text>
	)
}
function nanoid() {
	throw new Error("Function not implemented.")
}


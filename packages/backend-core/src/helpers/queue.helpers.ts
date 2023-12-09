import { Connection } from "@hazel/db"
import { sourceQueue } from "../queue"
import { convertRequestToBase64 } from "./request.helper"

export type SourceQueueData = {
	connectionId: string
	requestId: string
	request: Request
	body: string
	destinationUrl: string
}

export type ParsedSourceQueueData = {
	connectionId: string
	requestId: string
	request: string
}

export const convertDataForSourceQueue = async ({
	requestId,
	request,
	connectionId,
	destinationUrl,
	body,
}: SourceQueueData) => {
	const data: ParsedSourceQueueData = {
		requestId,
		connectionId,
		request: await convertRequestToBase64(destinationUrl, request, body),
	}

	return data
}

export const insertSourceQueue = async ({
	requestId,
	data,
	connection,
}: { requestId: string; data: ParsedSourceQueueData; connection: Connection }) => {
	sourceQueue.add(requestId, data, {
		delay: connection.delay || 0,
		attempts: connection.retyCount,
		backoff: {
			type: connection.retryType,
			delay: connection.retryDelay,
		},
	})
}

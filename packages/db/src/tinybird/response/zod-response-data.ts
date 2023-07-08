import { z } from "zod";
import { body, hazelVersion, headers, status, timestamp } from "../zod-common";

export const responseEventTimeSeries = z.object({
    customer_id: z.string(),
    source_id: z.string(),
    destination_id: z.string(),
    
    date: z.date(),
    
    events: z.number(),
    status: status
}).describe("Contains the number of events sent to a destination, grouped by date.")
export type ResponseEventTimeSeries = z.infer<typeof responseEventTimeSeries>

export const responseEvent = z.object({
	// IDs
	id: z.string(),
	customer_id: z.string(),
	source_id: z.string(),
	destination_id: z.string(),
	request_id: z.string(),
	
	// Metadata
	version: hazelVersion,

	// Timestamps
	timestamp: timestamp,
	send_timestamp: timestamp,

	// Status
	status,

	// Data
	body,
	headers,
})
export type ResponseEvent = z.infer<typeof responseEvent>

export const responseEventKpis = z.object({
	requests: z.number(),
	sources: z.number(),
	date: z.string(),
})
export type ResponseEventKpis = z.infer<typeof responseEventKpis>

import { cache } from "react"
import { notFound } from "next/navigation"
import { getConnection } from "db/src/orm/connection"
import { getSource, getSources } from "db/src/orm/source"

import db from "./db"
import { getDestination } from "db/src/orm/destination"

export const getCachedConnection = cache(async ({ publicId }: { publicId: string }) => {
	const connection = await getConnection({ publicId, db })

	if (!connection) {
		notFound()
	}

	return connection
})

export const getCachedSource = cache(async ({ publicId }: { publicId: string }) => {
	const source = await getSource({ publicId, db })

	if (!source) {
		notFound()
	}

	return source
})

export const getCachedDestination = cache(async ({ publicId }: { publicId: string }) => {
	const destination = await getDestination({ publicId, db })

	if (!destination) {
		notFound()
	}

	return destination
})

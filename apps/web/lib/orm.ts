import { cache } from "react"

import { getConnection } from "db/src/orm/connection"
import db from "./db"
import { notFound } from "next/navigation"
import { getSource, getSources } from "db/src/orm/source"

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

import { cache } from "react"

import { getConnection } from "db/src/orm/connection"
import db from "./db"
import { notFound } from "next/navigation"

export const getCachedConnection = cache(async ({ publicId }: { publicId: string }) => {
	const connection = await getConnection({ publicId, db })

	if (!connection) {
		notFound()
	}

	return connection
})

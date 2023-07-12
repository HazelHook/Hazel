import { cache } from "react"
import { notFound } from "next/navigation"

import { PromiseType } from "@/lib/ts/helpers"

import db from "./db"

export const getCachedConnection = cache(async ({ publicId }: { publicId: string }) => {
	const connection = await db.connection.getOne({ publicId })

	if (!connection) {
		notFound()
	}

	return connection
})
export type CacheConnection = PromiseType<ReturnType<typeof getCachedConnection>>

export const getCachedSource = cache(
	async ({
		publicId,
		redirectMissing = true,
	}: {
		publicId: string
		redirectMissing?: boolean
	}) => {
		const source = await db.source.getOne({ publicId })

		if (!source) {
			if (redirectMissing) {
				notFound()
			} else {
				return null
			}
		}

		return source
	},
)
export type CacheSource = PromiseType<ReturnType<typeof getCachedSource>>

export const getCachedDestination = cache(async ({ publicId }: { publicId: string }) => {
	const destination = await db.destination.getOne({ publicId })

	if (!destination) {
		notFound()
	}

	return destination
})
export type CacheDestination = PromiseType<ReturnType<typeof getCachedDestination>>

export type CacheIntegrationTool = PromiseType<ReturnType<typeof getCachedIntegrationTool>>
export const getCachedIntegrationTool = cache(
	async ({ slug }: { slug: string }) => {
		const integrationTool = await db.integrationTool.getOne({ slug })

		if (!integrationTool) {
			notFound()
		}

		return integrationTool
	},
)

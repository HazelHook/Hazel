import { notFound } from "next/navigation"

import { PromiseType } from "@/lib/ts/helpers"

import { db } from "@hazel/db"

export const getCachedConnection = async ({
	publicId,
}: {
	publicId: string
}) => {
	const connection = await db.connection.getOne({ publicId })

	if (!connection) {
		notFound()
	}

	return connection
}
export type CacheConnection = PromiseType<ReturnType<typeof getCachedConnection>>

export const getCachedSource = async ({
	publicId,
	workspaceId,
	redirectMissing = true,
}: {
	publicId: string
	workspaceId: string
	redirectMissing?: boolean
}) => {
	const source = await db.source.getOne({
		publicId,
		workspaceId,
		with: {
			connections: {
				with: {
					destination: true,
				},
			},
		},
	})

	if (!source) {
		if (redirectMissing) {
			notFound()
		} else {
			return null
		}
	}

	return source
}

export type CacheSource = PromiseType<ReturnType<typeof getCachedSource>>

export const getCachedDestination = async ({
	publicId,
}: {
	publicId: string
}) => {
	const destination = await db.destination.getOne({ publicId })

	if (!destination) {
		notFound()
	}

	return destination
}
export type CacheDestination = PromiseType<ReturnType<typeof getCachedDestination>>

export const getCachedIntegrations = async ({
	workspaceId,
}: {
	workspaceId: string
}) => {
	const integration = await db.integration.getMany({ workspaceId })

	if (!integration) {
		notFound()
	}

	return integration
}
export type CacheIntegrations = PromiseType<ReturnType<typeof getCachedIntegrations>>

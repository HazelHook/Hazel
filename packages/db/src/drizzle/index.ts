import { connect } from "@planetscale/database"
import { drizzle, PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"

import { DrizzleTable } from "./orm/db-table"
import * as schema from "./schema"
import { eq, InferModel } from "drizzle-orm"
import { generatePublicId } from "./schema/common"

export type DB = PlanetScaleDatabase<typeof schema>

export function connectDB({
	username,
	host,
	password,
}: {
	host: string
	username: string
	password: string
}) {
	const client = connect({
		username,
		host,
		password,
	})

	const db = drizzle(client, { schema })

	return {
		db,
		source: {
			table: new DrizzleTable("source", schema.source, db),
			getOne: async ({ publicId }: { publicId: string }) => {
				return await db.query.source.findFirst({
					where: eq(schema.source.publicId, publicId),
					with: {
						connections: {
							with: {
								destination: true,
							},
						},
					},
				})
			},
			getMany: async ({ customerId }: { customerId: string }) => {
				return await db.query.source.findMany({
					where: eq(schema.source.customerId, customerId),
					with: {
						connections: {
							with: {
								destination: true,
							},
						},
					},
				})
			},
			create: async (data: Omit<schema.InsertSource, "publicId">) => {
				const publicId = generatePublicId("src")
				const res = await db.insert(schema.source).values({
					...data,
					publicId,
				})

				return { res, publicId }
			},
		},
		destination: {
			table: new DrizzleTable("destination", schema.destination, db),
			getOne: async ({ publicId }: { publicId: string }) => {
				return await db.query.destination.findFirst({
					where: eq(schema.destination.publicId, publicId),
				})
			},
			getMany: async ({ customerId }: { customerId: string }) => {
				return await db.query.destination.findMany({
					where: eq(schema.destination.customerId, customerId),
					with: {
						connections: {
							with: {
								source: true,
							},
						},
					},
				})
			},
			create: async (data: Omit<schema.InsertDestination, "publicId">) => {
				const publicId = generatePublicId("dst")
				const res = await db.insert(schema.destination).values({
					...data,
					publicId,
				})

				return { res, publicId }
			},
		},
		connection: {
			table: new DrizzleTable("connection", schema.connection, db),
			getOne: async ({ publicId }: { publicId: string }) => {
				return await db.query.connection.findFirst({
					where: eq(schema.connection.publicId, publicId),
					with: {
						destination: true,
						source: true,
					},
				})
			},
			getMany: async ({ customerId }: { customerId: string }) => {
				return await db.query.connection.findMany({
					where: eq(schema.connection.customerId, customerId),
					with: {
						destination: true,
						source: true,
					},
				})
			},
			create: async (data: Omit<schema.InsertConnection, "publicId">) => {
				const publicId = generatePublicId("con")
				const res = await db.insert(schema.connection).values({
					...data,
					publicId,
				})
				return { res, publicId }
			},
		},
	}
}

// public async create(data: Omit<InferModel<typeof this.table, "insert">, "publicId">) {
// 	const abbreviation = iife(() => {
// 		switch (this.name) {
// 			case "connection":
// 				return "con"
// 			case "destination":
// 				return "dst"
// 			case "source":
// 				return "src"
// 			default:
// 				throw new Error("Invalid table name")
// 		}
// 	})
// 	const publicId = generatePublicId(abbreviation)

// 	const res = await this.db.insert(this.table).values({ ...data, publicId })

// 	return { res, publicId }
// }

// public async findFirst(data: IDFilter) {
// 	const where = iife(() => {
// 		if ("publicId" in data) {
// 			return eq(this.table.publicId, data.publicId)
// 		}
// 		if ("customerId" in data) {
// 			return eq(this.table.customerId, data.customerId)
// 		}
// 		throw new Error("Invalid ID filter")
// 	})

// 	const withResult = (() => {
// 		if (this.name === "connection") {
// 			return {
// 				destination: true,
// 				source: true,
// 			}
// 		} else if (this.name === "source") {
// 			return {
// 				connections: {
// 					with: {
// 						destination: true,
// 					},
// 				},
// 			}
// 		} else if (this.name === "destination") {
// 			return
// 		}
// 		throw new Error("Invalid table name")
// 	})()

// 	return await this.db.query[this.name].findFirst({
// 		where,
// 		with: withResult,
// 	})
// }

// public async findMany(data: IDFilter) {
// 	const where = iife(() => {
// 		if ("publicId" in data) {
// 			return eq(this.table.publicId, data.publicId)
// 		}
// 		if ("customerId" in data) {
// 			return eq(this.table.customerId, data.customerId)
// 		}
// 		throw new Error("Invalid ID filter")
// 	})

// 	const withResult = (() => {
// 		if (this.name === "connection") {
// 			return {
// 				source: true,
// 				destination: true,
// 			}
// 		} else if (this.name === "source") {
// 			return {
// 				connections: {
// 					with: {
// 						destination: true,
// 					},
// 				},
// 			}
// 		} else if (this.name === "destination") {
// 			return {
// 				connections: {
// 					with: {
// 						source: true,
// 					},
// 				},
// 			}
// 		}
// 		throw new Error("Invalid table name")
// 	})()

// 	return await this.db.query[this.name].findMany({
// 		where,
// 		with: withResult,
// 	})
// }

// export function connectWDB({
// 	username,
// 	host,
// 	password,
// 	fetch,
// }: {
// 	host: string
// 	username: string
// 	password: string
// 	fetch: any
// }) {
// 	const client = connect({
// 		username,
// 		host,
// 		password,
// 		fetch: (url, init) => {
// 			// @ts-expect-error
// 			init["cache"] = undefined
// 			return fetch(url, init)
// 		},
// 	})
// 	const db = drizzle(client, { schema })

// 	return db
// }

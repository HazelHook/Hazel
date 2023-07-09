import { eq, iife, InferModel, TableConfig } from "drizzle-orm"
import { _ } from "drizzle-orm/db.d-cf0abe10"
import { AnyMySqlColumn, MySqlTableWithColumns } from "drizzle-orm/mysql-core"

type IDFilter =
	| {
			publicId: string
	  }
	| {
			customerId: string
	  }

import { DB } from ".."
import { generatePublicId } from "../schema/common"

export class DrizzleTable<TableType extends keyof DB["query"]> {
	public readonly table: MySqlTableWithColumns<any>
	private readonly db: DB
	public readonly name: TableType

	constructor(name: TableType, table: MySqlTableWithColumns<any>, db: DB) {
		this.name = name
		this.table = table
		this.db = db
	}

	public async create(data: Omit<InferModel<typeof this.table, "insert">, "publicId">) {
		const abbreviation = iife(() => {
			switch (this.name) {
				case "connection":
					return "con"
				case "destination":
					return "dst"
				case "source":
					return "src"
				default:
					throw new Error("Invalid table name")
			}
		})
		const publicId = generatePublicId(abbreviation)

		const res = await this.db.insert(this.table).values({ ...data, publicId })

		return { res, publicId }
	}

	public async findFirst(data: IDFilter) {
		const where = iife(() => {
			if ("publicId" in data) {
				return eq(this.table.publicId, data.publicId)
			}
			if ("customerId" in data) {
				return eq(this.table.customerId, data.customerId)
			}
			throw new Error("Invalid ID filter")
		})

		const withResult = (() => {
			if (this.name === "connection") {
				return {
					destination: true,
					source: true,
				}
			} else if (this.name === "source") {
				return {
					connections: {
						with: {
							destination: true,
						},
					},
				}
			} else if (this.name === "destination") {
				return
			}
			throw new Error("Invalid table name")
		})()

		return await this.db.query[this.name].findFirst({
			where,
			with: withResult,
		})
	}

	public async findMany(data: IDFilter) {
		const where = iife(() => {
			if ("publicId" in data) {
				return eq(this.table.publicId, data.publicId)
			}
			if ("customerId" in data) {
				return eq(this.table.customerId, data.customerId)
			}
			throw new Error("Invalid ID filter")
		})

		const withResult = (() => {
			if (this.name === "connection") {
				return {
					source: true,
					destination: true,
				}
			} else if (this.name === "source") {
				return {
					connections: {
						with: {
							destination: true,
						},
					},
				}
			} else if (this.name === "destination") {
				return {
					connections: {
						with: {
							source: true,
						},
					},
				}
			}
			throw new Error("Invalid table name")
		})()

		return await this.db.query[this.name].findMany({
			where,
			with: withResult,
		})
	}

	public insert(data: Parameters<ReturnType<typeof this.db.insert<typeof this.table>>["values"]>) {
		return this.db.insert(this.table).values(...data)
	}

	public delete(data: Parameters<ReturnType<typeof this.db.delete<typeof this.table>>["where"]>) {
		return this.db.delete(this.table).where(...data)
	}

	public update(data: Parameters<ReturnType<typeof this.db.update<typeof this.table>>["set"]>) {
		return this.db.update(this.table).set(...data)
	}

	public select(data?: Parameters<typeof this.db["select"]>) {
		return data ? this.db.select(...data).from(this.table) : this.db.select().from(this.table)
	}

	public get selectDistinct() {
		return (data: Parameters<ReturnType<typeof this.db.selectDistinct<typeof this.table>>["from"]>) =>
			this.db.selectDistinct(this.table).from(...data)
	}
}

import { InferModel, TableConfig, eq } from "drizzle-orm"
import { AnyMySqlColumn, MySqlTableWithColumns } from "drizzle-orm/mysql-core"
import { DB } from ".."
import { _ } from "drizzle-orm/db.d-cf0abe10"

export class DrizzleTable<T extends TableConfig<AnyMySqlColumn>> {
	public readonly table: MySqlTableWithColumns<T>
	private readonly db: DB
	public readonly name: keyof typeof this.db["query"]

	constructor(name: keyof typeof db["query"], table: MySqlTableWithColumns<T>, db: DB) {
		this.name = name
		this.table = table
		this.db = db
	}

	public async findFirst(data: Parameters<typeof this.db.query[typeof this.name]["findFirst"]>) {
		// @ts-expect-error
		return await this.db.query[this.name].findFirst(...data)
	}

	public async findMany({ customerId }: { customerId: string }) {
		if (this.name === "connection") {
			return await this.db.query[this.name].findMany({
				where: eq(this.table.customerId, customerId),
				with: {
					source: true,
					destination: true,
				},
			})
		}
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

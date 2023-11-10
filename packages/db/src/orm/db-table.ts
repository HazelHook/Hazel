import { MySqlTableWithColumns } from "drizzle-orm/mysql-core"

import { DB } from "."

export class DrizzleTable<TableType extends keyof DB["query"]> {
	public readonly table: MySqlTableWithColumns<any>
	private readonly db: DB
	public readonly name: TableType

	constructor(name: TableType, table: MySqlTableWithColumns<any>, db: DB) {
		this.name = name
		this.table = table
		this.db = db
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

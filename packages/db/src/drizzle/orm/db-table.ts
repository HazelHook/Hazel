import {  InferModel, TableConfig, eq } from "drizzle-orm";
import { AnyMySqlColumn, MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { DB } from "..";

export class DrizzleTable<T extends TableConfig<AnyMySqlColumn>> {
    public readonly table: MySqlTableWithColumns<T>
    private readonly db: DB
    public readonly name: keyof typeof this.db['query']
    
    
    constructor(
        name: keyof typeof db['query'],
        table: MySqlTableWithColumns<T>,
        db: DB
    ) {
        this.name = name
        this.table = table
        this.db = db
    }

    public get findFirst() {
        return this.db.query[this.name].findFirst
    }

    public get findMany() {
        return this.db.query[this.name].findFirst
    }

    public get insert() {
        return (data: Parameters<ReturnType<typeof this.db.insert<typeof this.table>>['values']>) => this.db.insert(this.table).values(...data)
    }

    public get delete() {
        return (data: Parameters<ReturnType<typeof this.db.delete<typeof this.table>>['where']>) => this.db.delete(this.table).where(...data)
    }

    public get update() {
        return (data: Parameters<ReturnType<typeof this.db.update<typeof this.table>>['set']>) => this.db.update(this.table).set(...data)
    }

    public get select() {
        return (data: Parameters<ReturnType<typeof this.db.select<typeof this.table>>['from']>) => this.db.select(this.table).from(...data)
    }

    public get selectDistinct() {
        return (data: Parameters<ReturnType<typeof this.db.selectDistinct<typeof this.table>>['from']>) => this.db.selectDistinct(this.table).from(...data)
    }
}
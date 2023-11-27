import { MySqlSelect } from "drizzle-orm/mysql-core"

import { db, DBQueryConfig, ExtractTablesWithRelations } from "."
import { DB } from "./orm"
import * as schema from "./schema"

/**
 * Query helper extending the query adding offset based pagination to it
 *
 * @example Basic Example
 * ```ts
 * const query = db.select().from(users).where(eq(users.id, 1));
 *
 * const dynamicQuery = query.$dynamic();
 * withPagination(dynamicQuery, 1);
 *
 * ```
 *
 * @public
 */
export function withPagination<T extends MySqlSelect<any, any, any, any>>(qb: T, page: number, pageSize = 10) {
	return qb.limit(pageSize).offset(page * pageSize)
}

export type TrxType = Parameters<Parameters<DB["transaction"]>[0]>[0]

export type EitherAClientOrTrx = typeof db.db.transaction | TrxType

export type WithInput<Table extends ExtractTablesWithRelations<typeof schema>["source"]> = DBQueryConfig<
	"one",
	true,
	ExtractTablesWithRelations<typeof schema>,
	Table
>["with"]

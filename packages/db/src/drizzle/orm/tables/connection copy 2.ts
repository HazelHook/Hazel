import { DrizzleTable } from "../db-table"

import * as schema from "../../schema"
import { and, eq, isNull } from "drizzle-orm"
import { generatePublicId } from "../../schema/common"
import { DB, OptionalExceptFor } from ".."

const connectionLogic = (db: DB) => ({
	table: new DrizzleTable("connection", schema.connection, db),
})

export default connectionLogic

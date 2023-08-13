import bearer from "@elysiajs/bearer"
import db from "db/src/drizzle/orm"
import Elysia from "elysia"

import { ratelimit } from "./ratelimit.guard"

export const authGuard = (app: Elysia) =>
	app.use(bearer()).derive(async ({ bearer }) => {
		if (typeof bearer !== "string") {
			throw "Not good"
		}

		const apiKey = await db.apiKeys.getOne({ publicId: bearer })

		if (!apiKey) {
			throw new Error("Unauthorized")
		}

		const { success } = await ratelimit.limit(apiKey.workspaceId)

		if (!success) {
			throw new Error("Ratelimit")
		}

		return {
			workspace_id: apiKey.workspaceId,
		}
	})

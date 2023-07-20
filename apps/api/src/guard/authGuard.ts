import bearer from "@elysiajs/bearer"
import Elysia from "elysia"

import db from "db/src/drizzle"

export const authGuard = (app: Elysia) =>
	app.use(bearer()).derive(async ({ bearer }) => {
		if (typeof bearer !== "string") {
			throw "Not good"
		}

		const apiKey = await db.api.getOne({ publicId: bearer })

		if (!apiKey) {
			throw new Error("Unauthorized")
		}

		return {
			workspace_id: apiKey.customerId,
		}
	})

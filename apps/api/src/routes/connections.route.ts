import Elysia from "elysia"

export const connectionRouter = (app: Elysia) =>
	app.group("connections", (app) =>
		app
			.get("/", () => {
				return "Connections"
			})
			.get("/:id", () => {
				return "Connection"
			})
			.put("/:id", () => {})
			.delete("/:id", () => {})
			.post("/", () => {})
			.put("/pause", () => {})
			.put("/unpause", () => {}),
	)

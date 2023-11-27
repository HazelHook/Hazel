import Elysia from "elysia"

import { connectionRouter } from "./connections"
import { destinationRouter } from "./destination"
import { sourceRouter } from "./sources"

export const v1AppRouter = (app: Elysia) =>
	app.group("v1", (app) => app.use(connectionRouter).use(sourceRouter).use(destinationRouter))

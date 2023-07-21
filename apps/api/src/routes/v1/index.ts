import Elysia, { t } from "elysia"
import { authGuard } from "../../guard/authGuard"

import { connectionRouter } from "./connections"
import { sourceRouter } from "./sources"
import { destinationRouter } from "./destination"

export const v1AppRouter = (app: Elysia) =>
	app.group("v1", (app) => app.use(connectionRouter).use(sourceRouter).use(destinationRouter))

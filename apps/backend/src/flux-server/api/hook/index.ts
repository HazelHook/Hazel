import Elysia from "elysia"
import { addHookIngestEndpoint } from "./ingest"


export function addHookEndpoints(elysia: Elysia) {
	return elysia.group("/hook", (app) =>  addHookIngestEndpoint(app))
}

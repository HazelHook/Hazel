import { zValidator } from "@hono/zod-validator"
import { TM_DurableObject, Task, TaskManager, withTaskManager } from "do-taskmanager"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"
import { nanoid } from "nanoid"
import z from "zod"

type MessageBody = {
	url: string
	req: RequestInit
	request_id: string
	project_id: string
}

export type Bindings = {
	HAZEL_QUEUE: Queue<MessageBody>
	TASK_MANAGER: TaskManager
}

const app = new Hono<{ Bindings: Bindings }>()

app.use("/*", cors())
app.use("*", prettyJSON())

app.get("/", (c) => c.text("Hello Event Manager!"))

app.post("/:projectId", zValidator("json", z.any()), async (c) => {
	const projectId = c.req.param("projectId")

	const requestsId = `req_${nanoid()}`

	// const projects = await getProject(id)

	// TODO: Check if project exists && Check if request url matches project url

	c.env.HAZEL_QUEUE.send({
		url: "https://google.com",
		req: {
			method: c.req.method,
			headers: c.req.headers,
			body: c.req.body,
		},
		request_id: requestsId,
		project_id: projectId,
	})

	// TODO:Send  req as event to tinybird => with requestsId and projectId

	// TODO: Track Usage

	return c.json({
		status: "SUCCESS",
		message: `Webhook handled by Hazelhook. Check your dashboard to inspect the request: https://app.hazelhook.dev/request/${requestsId}`,
		request_id: requestsId,
		project_id: projectId,
	})
})

class EventManager implements TM_DurableObject {
	private storage: DurableObjectStorage
	constructor(state: DurableObjectState, protected readonly env: Bindings) {
		this.storage = state.storage
	}
	async processTask(task: Task): Promise<void> {
		console.log("Processing Task!")
		if (task.context === "schedule-time1" && task.attempt < 2) {
			console.log("Failing task for the first time")
			throw new Error("Not this time!")
		}
		this.storage.put(`processed::receivedAt::${Date.now()}::${task.id}}`, task)
	}
	async fetch(request: Request): Promise<Response> {
		const nextMinute = Date.now() + 60 * 1000
		const headers = [...request.headers.entries()]
		await this.env.TASK_MANAGER.scheduleTaskIn(nextMinute, { url: request.url, headers })
		return new Response("Scheduled!")
	}
}

const EVENT_DO = withTaskManager(EventManager)

export default {
	fetch: app.fetch,
	EVENT_DO: EVENT_DO,
}

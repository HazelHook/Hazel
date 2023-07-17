import axios from "axios"
import { Program } from "./state/program.js"
import express from "express"
import { oauthCallback } from "./api/oauth-callback.js"
import { getUnusedPort } from "./util.js"

const app = express()

const client = axios.create({
	baseURL: process.env["BACKEND_URL"],
	headers: {
		Host: `localhost:${process.env["PORT"]}`,
		"Content-Type": "application/json",
	},
})
const program = new Program(client)

app.get("/oauth2/callback?", oauthCallback(client, () => {
	console.log("logged in")
    program.loggedIn()
}))
// app.get("/ws/:id", (req) => {
// 	console.log("websocket", req.params.id)
// 	program.websocket(req.params.id)
// })

const port = await getUnusedPort()
process.env["PORT"] = port.toString()

program.executeState()

app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})

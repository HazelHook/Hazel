// @ts-nocheck

import http from "http"
import React from "react"
import axios from "axios"
import express from "express"
import { render } from "ink"
import keytar from "keytar"
import meow from "meow"
import portfinder from "portfinder"

import App from "./app.js"

const app = express()

const client = axios.create({
	baseURL: process.env["BACKEND_URL"],
	headers: {
		Host: `localhost:${process.env["PORT"]}`,
		"Content-Type": "application/json",
	},
})

interface Token {
	access_token: string
	refresh_token: string
	expires_at: number
}
async function storeToken(token: {
	access_token: string
	refresh_token: string
	expires_in: number
}) {
	const expires_at = new Date().getTime() + token.expires_in * 1000

	await keytar.setPassword(
		"hazel",
		"token",
		JSON.stringify({
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			expires_at,
		}),
	)
}

async function getToken(): Token {
	return JSON.parse(await keytar.getPassword("hazel", "token"))
}
const token = await getToken()

const getUnusedPort = async () => {
	try {
		return await new Promise((resolve, reject) => {
			portfinder.getPorts(
				1,
				{
					host: "localhost",
					// 38204 - 38799 are widely unused ports. We need to hardcode ports because the callback URL of OAuth2 is fixed.
					port: 38404,
					stopPort: 38414,
				},
				(err, ports) => {
					if (err) {
						reject(err)
					} else {
						resolve(ports[0])
					}
				},
			)
		})
	} catch (e) {
		console.error(e)
		throw new Error("Failed to find unused port. Please free a port in range 38404:38414.")
	}
}

meow(
	`
	Usage
	  $ clibun

	Options
		--name  Your name

	Examples
	  $ clibun --name=Jane
	  Hello, Jane
`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: "string",
			},
		},
	},
)

app.get("/oauth2/callback?", async (req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/html",
	})
	res.end(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>OAuth Success</title>
		
			<!-- Bootstrap CSS -->
			<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet">
			<style>
				.center-screen {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					height: 100vh;
					text-align: center;
				}
				.btn {
					margin-top: 20px;
				}
			</style>
		</head>
		<body>
			<div class="center-screen">
				<h2 class="display-4">Authentication Successful!</h2>
				<p class="lead">You may now return to the application.</p>
			</div>
		</body>
		</html>
		
		`)

	const code = req.query["code"]
	const token = await client.post(`http://127.0.0.1:3003/v1/oauth-token/${process.env["PORT"]}`, {
		token: code,
		token_type: "code",
	})

	console.log(token)

	await storeToken({
		access_token: token.data.access_token,
		refresh_token: token.data.refresh_token,
		expires_in: token.data.expires_in,
	})

	return
})

const port = await getUnusedPort()
process.env["PORT"] = port.toString()

app.listen(port, () => {
	render(<App client={client} token={token} />)
})

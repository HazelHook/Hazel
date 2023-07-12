
import App from "./app.js"
import { render } from "hazel-clui/src/ink"
import React from "react"


render(
	<App />,
	{
		patchConsole: true,
	},
)

import meow from "meow"

import App from "./app.jsx"
import { render } from "./ext/ink.js"
import { GlobalStateProvider } from "./lib/datasource.jsx"

const cli = meow(
	`
	Usage
	  $ scripts

	Options
		--name  Your name

	Examples
	  $ scripts --name=Jane
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

render(
	<GlobalStateProvider>
		<App />
	</GlobalStateProvider>,
	{
		patchConsole: true,
	},
)

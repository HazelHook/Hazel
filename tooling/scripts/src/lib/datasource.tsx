import childProcess from "node:child_process"
import React from "react"

import stripAnsi from "strip-ansi"

import { connectWDB } from "../../../../packages/db/src"

interface Datasource {
	prefix: string
	version: string
	"shared from": string
	name: string
	row_count: number
	size: number
	"created at": string
	"updated at": string
	connection: string
}
interface Datasources {
	datasources: Datasource[]
	db: ReturnType<typeof connectWDB>
}

const db = connectWDB({
	username: process.env.PLANETSCALE_DB_USERNAME!,
	password: process.env.PLANETSCALE_DB_PASSWORD!,
	host: process.env.PLANETSCALE_DB_HOST!,
	fetch,
})

const output = stripAnsi(
	childProcess.execSync(`tb --token ${process.env.TINY_TOKEN!} datasource ls --format json`).toString("utf8"),
)
const datasources: Datasources = {
	datasources: JSON.parse(output).datasources,
	db,
}

const DataSourcesContext = React.createContext<Datasources>(datasources)
const DataSourcesDispatchContext = React.createContext(undefined)

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_DATASOURCES":
			return {
				...state,
				datasources: action.payload,
			}
		default:
			return state
	}
}

export const useDataSources = () => [
	React.useContext<Datasources>(DataSourcesContext),
	React.useContext(DataSourcesDispatchContext),
]

export const GlobalStateProvider = ({ children }) => {
	const [state, dispatch] = React.useReducer(reducer, datasources)
	return (
		<DataSourcesContext.Provider value={state}>
			<DataSourcesDispatchContext.Provider value={dispatch}>{children}</DataSourcesDispatchContext.Provider>
		</DataSourcesContext.Provider>
	)
}

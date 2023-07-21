import { Module } from "./modules/module.tsx"

declare global {
	// rome-ignore lint/style/noVar: <explanation>
	var hazelModule: Module
}
export default global

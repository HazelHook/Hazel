import { BlessedModule } from "./blessed/index.js"
import { Module } from "./module.js"

export function getModule(): Module {
	return BlessedModule.create()
}

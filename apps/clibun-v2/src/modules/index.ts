import { BasicModule } from "./basic/index.js";
import { Module } from "./module.js";

export function getModule(): Module {
    return BasicModule.create()
}
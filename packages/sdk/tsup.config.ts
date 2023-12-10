import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts", "src/next.ts"],
	format: ["cjs", "esm"],
	sourcemap: true,
	clean: true,
	bundle: true,
	dts: true,
})

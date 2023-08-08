import image from "@astrojs/image"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import compress from "astro-compress"
import { defineConfig } from "astro/config"

export default defineConfig({
	experimental: {
		assets: true,
	},
	markdown: {
		drafts: true,
		shikiConfig: {
			theme: "css-variables",
		},
	},
	shikiConfig: {
		wrap: true,
		skipInline: false,
		drafts: true,
	},
	site: "https://hazelhook.dev",
	integrations: [tailwind(), image(), compress(), sitemap(), mdx(), react()],
})

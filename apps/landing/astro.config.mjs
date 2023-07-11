import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import image from "@astrojs/image"
import compress from "astro-compress"
import sitemap from "@astrojs/sitemap"
import mdx from "@astrojs/mdx" // https://astro.build/config

// https://astro.build/config
export default defineConfig({
	markdown: {
		drafts: true,
		shikiConfig: { theme: "css-variables" },
	},
	shikiConfig: {
		wrap: true,
		skipInline: false,
		drafts: true,
	},
	site: "https://hazelhook.dev",
	integrations: [tailwind(), image(), compress(), sitemap(), mdx()],
})

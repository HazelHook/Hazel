import { ThemeProvider } from "@/components/ThemeProvider"
import { component$, Slot } from "@builder.io/qwik"
import type { RequestHandler } from "@builder.io/qwik-city"

export const onGet: RequestHandler = async ({ cacheControl }) => {
	// Control caching for this request for best performance and to reduce hosting costs:
	// https://qwik.builder.io/docs/caching/
	cacheControl({
		// Always serve a cached response by default, up to a week stale
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		// Max once every 5 seconds, revalidate on the server to get a fresh version of this page
		maxAge: 5,
	})
}

export default component$(() => {
	return (
		<>
			<div class="relative flex min-h-screen flex-col">
				<div class="grid grow lg:grid-cols-5">
					<Sidebar
						params={params}
						class="fixed flex w-12 flex-col justify-between transition-[width] duration-1000 lg:w-64"
					/>
					<div class="col-span-full ml-12 border-l h-full transition-[margin] duration-1000 lg:ml-64">
						{/* <SiteHeader /> */}

						<Slot />
					</div>
				</div>
				{/* <Toaster position="top-center" /> */}
			</div>
			<ThemeProvider />
		</>
	)
})

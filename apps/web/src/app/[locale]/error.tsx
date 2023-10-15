"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Image } from "@unpic/react"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error)
	}, [error])

	return (
		<div className="mx-auto flex h-screen w-full px-4 container max-w-2xl flex-col items-center justify-center gap-8">
			<div className="bg-card p-6 border rounded-full">
				<p className="text-center text-2xl font-semibold text-primary">
					Uh-oh! It seems our squirrels have gone nuts.
				</p>
			</div>
			<div className="w-[300px] h-[300px]">
				<Image src={"/assets/avatar/500.png"} layout="fullWidth" />
			</div>
			<h3 className="text-center text-2xl">
				{"Our system's acting a bit squirrelly, and we're as flabbergasted as a hazelnut in a peanut party."}
			</h3>
			<p className="text-center text-lg text-muted-foreground">
				{
					"If this error continues to drop in uninvited, please let our team know. We'll have our best squirrels scurry to crack this nut of a problem. Your patience is greatly appreciated!"
				}
			</p>
			<div className="flex flex-col md:flex-row gap-4 w-full justify-center">
				<Button
					className="w-full md:max-w-max"
					onClick={
						// Attempt to recover by trying to re-render the segment
						() => reset()
					}
				>
					Reload
				</Button>
				<Link href="/">
					<Button className="w-full md:max-w-max" variant="outline">
						Go back Home
					</Button>
				</Link>
			</div>
		</div>
	)
}

// export const runtime = "edge"

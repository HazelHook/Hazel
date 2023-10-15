import Link from "next/link"
import { Image } from "@unpic/react"

import { Button } from "@//components/ui/button"

export default function NotFoundPage() {
	return (
		<div className="mx-auto flex h-screen w-full px-4 container max-w-2xl flex-col items-center justify-center gap-8">
			<div className="bg-card p-6 border rounded-full">
				<p className="text-center text-2xl font-semibold text-primary">
					Whoops! Our squirrels have led you down the wrong tree branch.
				</p>
			</div>
			<div className="w-[300px] h-[300px]">
				<Image src={"/assets/avatar/404.png"} layout="fullWidth" />
			</div>
			<h3 className="text-center text-2xl">
				{"The page you're looking for is as elusive as a hazelnut at a squirrel convention."}
			</h3>
			<p className="text-center text-lg text-muted-foreground">
				Stuck? Just holler, we're here to help. Our squirrel team is already on a mission to put things right.
				Your understanding is much appreciated!
			</p>
			<div className="flex flex-col md:flex-row gap-4 w-full justify-center">
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

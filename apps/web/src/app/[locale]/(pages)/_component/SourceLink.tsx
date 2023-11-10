import "server-only"

import { Suspense } from "react"
import Link from "next/link"

import { getCachedSource } from "@/lib/orm"
import { Await } from "@hazel/ui/await"

interface SourceLinkProps {
	sourceId: string
}

export const SourceLink = async ({ sourceId }: SourceLinkProps) => {
	const source = getCachedSource({
		publicId: sourceId,
		redirectMissing: false,
	})

	return (
		<Await promise={source}>
			{(data) => (
				<Link className="underline-offset-4 hover:underline text-primary" href={`/source/${sourceId}`}>
					<Suspense fallback={sourceId}>{data?.name || "Not Found"}</Suspense>
				</Link>
			)}
		</Await>
	)
}

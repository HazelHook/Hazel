import "server-only"

import { Suspense } from "react"
import Link from "next/link"

import { getCachedSource } from "@/lib/orm"
import { Await } from "@hazel/ui/await"
import { auth } from "@/lib/auth"

interface SourceLinkProps {
	sourceId: string
}

export const SourceLink = async ({ sourceId }: SourceLinkProps) => {
	const { workspaceId } = await auth()

	const source = getCachedSource({
		publicId: sourceId,
		workspaceId,
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

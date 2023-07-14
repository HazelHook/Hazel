import "server-only"

import { Suspense } from "react"
import Link from "next/link"

import { getCachedSource } from "@/lib/orm"

interface SourceLinkProps {
	sourceId: string
}

export const SourceLink = async ({ sourceId }: SourceLinkProps) => {
	const source = getCachedSource({
		publicId: sourceId,
		redirectMissing: false,
	})

	return (
		<Link className="underline-offset-4 hover:underline text-primary" href={`/source/${sourceId}`}>
			<Suspense fallback={sourceId}>{(await source)?.name || "Not Found"}</Suspense>
		</Link>
	)
}

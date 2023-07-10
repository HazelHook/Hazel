import "server-only"

import { getCachedSource } from "@/lib/orm"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"

interface SourceLinkProps {
	sourceId: string
}

export const SourceLink = async ({ sourceId }: SourceLinkProps) => {
	const source = getCachedSource({ publicId: sourceId, redirectMissing: false })

	return (
		<Link className="underline-offset-4 hover:underline text-primary" href={`/source/${sourceId}`}>
			<Suspense fallback={sourceId}>{(await source)?.name || "Not Found"}</Suspense>
		</Link>
	)
}

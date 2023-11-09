import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PaginationState } from "@tanstack/react-table"

export const usePagination = () => {
	const [pageState, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	})

	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	const createQueryString = useCallback(
		(values: { name: string; value: string | number }[]) => {
			const params = new URLSearchParams(searchParams as any)
			// biome-ignore lint/complexity/noForEach: <explanation>
			values.forEach(({ name, value }) => {
				params.set(name, String(value))
			})

			return params.toString()
		},
		[searchParams],
	)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		router.push(
			`${pathname}?${createQueryString([
				{ name: "page", value: pageState.pageIndex },
				{ name: "limit", value: pageState.pageSize },
			])}`,
		)
	}, [pageState])

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (searchParams.has("limit") || searchParams.get("page")) {
			setPagination({
				pageSize: Number(searchParams.get("limit")) || 10,
				pageIndex: Number(searchParams.get("page")) || 0,
			})
		}
	}, [])

	return { state: pageState, setPagination }
}

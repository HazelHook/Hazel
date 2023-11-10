import { ReactNode, Suspense } from "react"

export async function Await<T>({
	promise,
	children,
	fallback,
}: {
	promise: Promise<T>
	children: (result: T) => JSX.Element | JSX.Element[]
	fallback?: ReactNode
}) {
	return (
		<Suspense fallback={fallback}>
			<NestedAwait promise={promise}>{children}</NestedAwait>
		</Suspense>
	)
}

async function NestedAwait<T>({
	promise,
	children,
}: {
	promise: Promise<T>
	children: (result: T) => JSX.Element | JSX.Element[]
}) {
	const result = await promise

	return children(result)
}

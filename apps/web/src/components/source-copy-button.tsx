import { CopyButton } from "./copy-button"

export type SourceCodeProps = {
	sourceId: string
}

export const SourceCopyButton = ({ sourceId }: SourceCodeProps) => {
	return (
		<CopyButton
			value={`${process.env.NEXT_PUBLIC_HAZEL_BACKEND_URL}/v1/hook/${sourceId}`}
			display={`${process.env.NEXT_PUBLIC_HAZEL_BACKEND_URL}/v1/hook/${sourceId}`.replace("https://", "")}
		/>
	)
}

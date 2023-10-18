import PageLoadingIndicator from "@/components/page-loading-indicator"

function Loading() {
	return (
		<div className={"flex h-full items-center py-8"}>
			<PageLoadingIndicator displayLogo={false} fullPage={false} />
		</div>
	)
}

export default Loading

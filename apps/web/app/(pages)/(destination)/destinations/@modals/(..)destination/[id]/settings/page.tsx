import { Dialog, InterceptedDialogContent } from "@/components/ui/dialog"
import { DestinationSettingsPage } from "@/components/pages/destination/SettingsPage"

const ConnectionUpdateFormPage = ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	return (
		<Dialog open>
			<InterceptedDialogContent>
				<DestinationSettingsPage isModal id={params.id} />
			</InterceptedDialogContent>
		</Dialog>
	)
}

export default ConnectionUpdateFormPage

// export const runtime = "edge"

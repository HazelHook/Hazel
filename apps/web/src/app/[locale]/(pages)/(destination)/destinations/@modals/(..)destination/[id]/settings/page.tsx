import { DestinationSettingsPage } from "@/components/pages/destination/SettingsPage"

import { Dialog, InterceptedDialogContent } from "@hazel/ui/dialog"

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

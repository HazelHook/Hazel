import { ConnectionSettingsPage, SettingsProps } from "@/components/pages/connection/SettingsPage"
import { Dialog, InterceptedDialogContent } from "@/components/ui/dialog"

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
				<ConnectionSettingsPage isModal id={params.id} />
			</InterceptedDialogContent>
		</Dialog>
	)
}

export default ConnectionUpdateFormPage

export const runtime = "edge"

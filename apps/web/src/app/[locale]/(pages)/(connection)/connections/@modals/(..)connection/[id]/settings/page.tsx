import { Dialog, InterceptedDialogContent } from "@hazel/ui/dialog"

import { ConnectionSettingsPage } from "@/components/pages/connection/SettingsPage"

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

// export const runtime = "edge"

import { ConnectionSettingsPage } from "@/components/pages/connection/SettingsPage"
import { Container } from "@/components/ui/container"

const EditConnectionPage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	return (
		<Container>
			<ConnectionSettingsPage id={params.id} />
		</Container>
	)
}

export default EditConnectionPage

export const runtime = "edge"

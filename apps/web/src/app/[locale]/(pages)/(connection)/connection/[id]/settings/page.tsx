import { Container } from "@//components/ui/container"
import { ConnectionSettingsPage } from "@//components/pages/connection/SettingsPage"

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

// export const runtime = "edge"

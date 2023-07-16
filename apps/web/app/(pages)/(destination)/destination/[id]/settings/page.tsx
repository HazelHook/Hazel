import { DestinationSettingsPage } from "@/components/pages/destination/SettingsPage"
import { Container } from "@/components/ui/container"

const UpdateDestinationPage = async ({
	params,
}: {
	params: {
		id: string
	}
}) => {
	return (
		<Container>
			<DestinationSettingsPage id={params.id} />
		</Container>
	)
}

export default UpdateDestinationPage

export const runtime = "edge"

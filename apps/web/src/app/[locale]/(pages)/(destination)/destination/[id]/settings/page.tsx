import { Container } from "@hazel/ui/container"
import { DestinationSettingsPage } from "@/components/pages/destination/SettingsPage"

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

// export const runtime = "edge"

import { createDestinationAction } from "@/server/actions/destination"
import { CreateDestinationForm } from "@/components/forms/destination/create-destination-form"

const NewSourcePage = () => {
	return (
		<main className="p-4">
			<CreateDestinationForm action={createDestinationAction} />
		</main>
	)
}

// export const runtime = "edge"

export default NewSourcePage

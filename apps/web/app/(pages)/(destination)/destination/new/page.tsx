import { createDestinationAction } from "@/server/actions/destination"
import { NewDestinationForm } from "./form"

const NewSourcePage = () => {
	return (
		<main className="p-4">
			<NewDestinationForm action={createDestinationAction} />
		</main>
	)
}

export const runtime = "edge"

export default NewSourcePage

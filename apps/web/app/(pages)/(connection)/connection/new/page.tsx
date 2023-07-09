
import { auth } from "@/lib/auth"
import db from "@/lib/db"

import { createConnectionAction } from "./_actions"
import { NewConnectionForm } from "./form"

const NewConnectionPage = async () => {
	const { userId } = auth()

	const sources = await db.source.getMany({ customerId: userId })
	const destinations = await db.destination.getMany({ customerId: userId })
	return (
		<main className="p-4">
			<NewConnectionForm action={createConnectionAction} destinations={destinations} sources={sources} />
		</main>
	)
}

export const runtime = "edge"

export default NewConnectionPage

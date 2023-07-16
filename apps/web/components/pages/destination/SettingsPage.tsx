import "server-only"

import db from "@/lib/db"
import { UpdateDestinationForm } from "@/app/(pages)/(destination)/_components/UpdateDestinationForm"
import { updateDestinationAction } from "@/app/(pages)/(destination)/_actions"
import { notFound } from "next/navigation"

export interface SettingsProps {
	id: string
	isModal?: boolean
}

export const DestinationSettingsPage = async ({ id, isModal }: SettingsProps) => {
	const destination = await db.destination.getOne({ publicId: id })

	if (!destination) {
		notFound()
	}

	return <UpdateDestinationForm data={destination} updateAction={updateDestinationAction} isModal={isModal} />
}

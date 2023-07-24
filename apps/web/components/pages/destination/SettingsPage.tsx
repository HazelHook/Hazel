import "server-only"

import { notFound } from "next/navigation"

import db from "@/lib/db"
import { UpdateDestinationForm } from "@/app/(pages)/(destination)/_components/UpdateDestinationForm"
import { updateDestinationAction } from "@/server/actions/destination"

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

import "server-only"

import { notFound } from "next/navigation"
import { db } from "@hazel/db"

import { updateDestinationAction } from "@/server/actions/destination"
import { UpdateDestinationForm } from "@/components/forms/destination/update-destination-form"

export interface SettingsProps {
	id: string
	isModal?: boolean
}

export const DestinationSettingsPage = async ({ id, isModal }: SettingsProps) => {
	const destination = await db.destination.getOne({ publicId: id })

	if (!destination) {
		notFound()
	}

	return <UpdateDestinationForm destination={destination} updateAction={updateDestinationAction} isModal={isModal} />
}

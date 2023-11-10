import "server-only"

import { notFound } from "next/navigation"

import { updateDestinationAction } from "@/server/actions/destination"
import { db } from "@hazel/db"
import { UpdateDestinationForm } from "@/components/forms/destination/UpdateDestinationForm"

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

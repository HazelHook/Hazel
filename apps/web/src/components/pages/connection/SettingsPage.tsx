import "server-only"

import { notFound } from "next/navigation"

import { updateConnectionAction } from "@/server/actions/connections"
import { auth } from "@/lib/auth"
import { UpdateConnectionForm } from "@/app/[locale]/(pages)/(connection)/connection/[id]/settings/form"

import { db } from "@hazel/db"

export interface SettingsProps {
	id: string
	isModal?: boolean
}

export const ConnectionSettingsPage = async ({ id, isModal }: SettingsProps) => {
	await auth()

	const connection = await db.connection.getOne({ publicId: id })

	if (!connection) {
		notFound()
	}

	return <UpdateConnectionForm connection={connection} action={updateConnectionAction} isModal={isModal} />
}

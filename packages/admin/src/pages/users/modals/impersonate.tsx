import { getSupabaseServerClient } from "@hazel/supabase/clients"
import ImpersonateUserConfirmationModal from "../../../internal/components/impersonate-user-confirmation-modal"
import { impersonateUserAction } from "@hazel/auth/actions"

export interface ImpersonateUserModalPageProps {
	params: {
		id: string
	}
}

export async function ImpersonateUserModalPage({ params }: ImpersonateUserModalPageProps) {
	const client = getSupabaseServerClient({ admin: true })
	const { data, error } = await client.auth.admin.getUserById(params.id)

	if (!data || error) {
		throw new Error("User not found")
	}

	return <ImpersonateUserConfirmationModal impersonateAction={impersonateUserAction} user={data.user} />
}

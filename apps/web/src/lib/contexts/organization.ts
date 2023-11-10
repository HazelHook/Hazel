import { createContext } from "react"
import { Organization } from "@hazel/db"

const OrganizationContext = createContext<{
	organization: Maybe<Organization>
	setOrganization: (organization: Maybe<Organization>) => void
}>({
	organization: undefined,
	setOrganization: (_) => _,
})

export default OrganizationContext

import { Organization } from "db/src/drizzle"
import { createContext } from "react"

const OrganizationContext = createContext<{
	organization: Maybe<Organization>
	setOrganization: (organization: Maybe<Organization>) => void
}>({
	organization: undefined,
	setOrganization: (_) => _,
})

export default OrganizationContext

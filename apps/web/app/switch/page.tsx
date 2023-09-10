import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import getSupabaseServerClient from "@/core/supabase/server-client"
import requireSession from "@/lib/user/require-session"
import db from "@/lib/db"
import configuration from "@/configuration"
import initializeServerI18n from "@/i18n/i18n.server"
import getLanguageCookie from "@/i18n/get-language-cookie"
import I18nProvider from "@/i18n/I18nProvider"
import { Container } from "@/components/ui/container"
import If from "@/components/ui/if"
import { switchOrganizationAction } from "@/server/actions/organization"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRightIcon } from "@/components/icons/pika/chevronRight"
import { LogoIcon } from "@/components/icons/Logo"
import Heading from "@/components/ui/heading"
import { CreateOrg } from "./components/CreateOrg"

async function OrganizationsPage() {
	const client = getSupabaseServerClient()
	const session = await requireSession(client)

	const user = await db.user.getOne({ id: session.user.id })

	if (!user || !user.onboarded) {
		redirect(configuration.paths.onboarding)
	}

	const cookiesList = cookies()

	const membershipId = cookiesList.get("membership_id")?.value

	if (membershipId) {
		const currOrg = await db.organization.memberships.getOne({ membershipId })

		if (currOrg) {
			redirect(configuration.paths.home)
		}
	}

	const memberships = await db.organization.memberships.getMany({ customerId: user.id })

	const i18n = await initializeServerI18n(getLanguageCookie())
	const csrfToken = headers().get("X-CSRF-Token") ?? ""

	const organizations = memberships.map((item) => item.organization)

	if (organizations.length === 1) {
		const organization = organizations[0]

		await switchOrganizationAction({ publicId: organization.publicId })

		return redirect(configuration.paths.home)
	}

	return (
		<I18nProvider lang={i18n.language}>
			<div className={"flex flex-col space-y-8"}>
				<OrganizationsPageHeader />

				<div className="w-full p-3 flex flex-col flex-1">
					<Container>
						<div className={"lg:grid-col-3 grid grid-cols-1 gap-4 xl:grid-cols-4 xl:gap-6"}>
							{/* <NewOrganizationButtonContainer csrfToken={csrfToken} /> */}
							<CreateOrg />
							{organizations.map((organization) => {
								return (
									<Link href={configuration.paths.home}>
										<Button className={"relative"} key={organization.id}>
											<span
												className={"absolute left-6 top-4 flex justify-start" + " h-full w-full items-center space-x-4"}
											>
												<If condition={false}>
													{(logo) => (
														<Image
															width={36}
															height={36}
															className={"contain rounded-full"}
															src={""}
															alt={`${organization.name} Logo`}
														/>
													)}
												</If>

												<span className={"flex items-center space-x-2.5 text-base font-medium"}>
													<span>{organization.name}</span>

													<ChevronRightIcon className={"h-4"} />
												</span>
											</span>
										</Button>
									</Link>
								)
							})}
						</div>
					</Container>
				</div>
			</div>
		</I18nProvider>
	)
}

export default OrganizationsPage

function OrganizationsPageHeader() {
	return (
		<div className="flex flex-1 items-center justify-between border-b border-gray-50 p-4 dark:border-dark-700">
			<div className={"flex w-full flex-1 justify-between"}>
				<div className={"flex items-center justify-between space-x-4 lg:space-x-0"}>
					<div className={"flex items-center space-x-2 lg:space-x-4 xl:space-x-6"}>
						<LogoIcon />

						<Heading type={5}>
							<span className={"flex items-center space-x-0.5 lg:space-x-2"}>
								<span className={"lg:text-initial text-base font-medium dark:text-white"}>Your Organizations</span>
							</span>
						</Heading>
					</div>
				</div>
			</div>
		</div>
	)
}

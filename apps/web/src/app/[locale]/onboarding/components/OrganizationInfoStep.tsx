"use client"

import type { FormEvent } from "react"
import { useCallback } from "react"
import { Button } from "@hazel/ui/button"
import Heading from "@hazel/ui/heading"
import { Input } from "@hazel/ui/input"
import { Label } from "@hazel/ui/label"

import { useAuth } from "@/lib/provider/AuthProvider"
import { ArrowRightIcon } from "@hazel/icons"

export interface OrganizationInfoStepData {
	organization: string
}

const OrganizationInfoStep: React.FCC<{
	onSubmit: (data: OrganizationInfoStepData) => void
}> = ({ onSubmit }) => {
	const { user } = useAuth()
	const displayName = user?.email

	const handleFormSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault()

			const data = new FormData(event.currentTarget)
			const organization = data.get("organization") as string

			onSubmit({
				organization,
			})
		},
		[onSubmit],
	)

	return (
		<form onSubmit={handleFormSubmit} className={"flex w-full flex-1 flex-col space-y-6"}>
			<div className={"flex flex-col space-y-1.5"}>
				<Heading type={2}>Hi, {displayName}</Heading>
				<Heading type={3} className="text-muted-foreground">
					Let&apos;s create your organization.
				</Heading>
			</div>

			<div className={"flex flex-1 flex-col space-y-2"}>
				<div className="space-y-1">
					<Label>Your organization&apos;s name</Label>

					<Input required name={"organization"} placeholder={"Organization Name"} />
				</div>

				<div>
					<Button type={"submit"}>
						<span className={"flex items-center space-x-2"}>
							<span>Continue</span>
							<ArrowRightIcon className={"h-5"} />
						</span>
					</Button>
				</div>
			</div>
		</form>
	)
}

export default OrganizationInfoStep

"use client"

import { useCallback, useState } from "react"

import { useFactorsMutationKey, useFetchAuthFactors } from "@hazel/auth/hooks"
import { CrossIcon } from "@hazel/icons"
import { useSupabase } from "@hazel/supabase/hooks"
import Alert from "@hazel/ui/alert"
import { Badge } from "@hazel/ui/badge"
import { Button } from "@hazel/ui/button"
import { Card } from "@hazel/ui/card"
import { Container } from "@hazel/ui/container"
import { If } from "@hazel/ui/if"
import Modal from "@hazel/ui/modal"
import { PageHeader } from "@hazel/ui/page-header"
import { Spinner } from "@hazel/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hazel/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@hazel/ui/tooltip"
import { Factor } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import useMutation from "swr/mutation"

import MultiFactorAuthSetupModal from "./mfa-setup-modal"

const MAX_FACTOR_COUNT = 10

function MultiFactorAuthenticationSettings() {
	const t = useTranslations("profile")

	const [isMfaModalOpen, setIsMfaModalOpen] = useState(false)

	return (
		<Container>
			<PageHeader title={t("multiFactorAuth")} subtitle={t("multiFactorAuthSubheading")} />
			<Card className="p-3">
				<MultiFactorAuthFactorsList onEnrollRequested={() => setIsMfaModalOpen(true)} />
			</Card>

			<MultiFactorAuthSetupModal isOpen={isMfaModalOpen} setIsOpen={setIsMfaModalOpen} />
		</Container>
	)
}

export default MultiFactorAuthenticationSettings

function MultiFactorAuthFactorsList({
	onEnrollRequested,
}: React.PropsWithChildren<{
	onEnrollRequested: () => void
}>) {
	const t = useTranslations("profile")

	const { data: factors, isLoading, error } = useFetchAuthFactors()
	const [unEnrolling, setUnenrolling] = useState<string>()

	if (isLoading) {
		return (
			<div className={"flex items-center space-x-4"}>
				<Spinner />

				<div>{t("loadingFactors")}</div>
			</div>
		)
	}

	if (error) {
		return (
			<div>
				<Alert type={"error"}>{t("factorsListError")}</Alert>
			</div>
		)
	}

	const allFactors = factors?.all ?? []

	if (!allFactors.length) {
		return (
			<div className={"flex flex-col space-y-4"}>
				<Alert type={"info"}>
					<Alert.Heading>{t("multiFactorAuthHeading")}</Alert.Heading>
					{t("multiFactorAuthDescription")}
				</Alert>

				<SetupMfaButton onClick={onEnrollRequested} />
			</div>
		)
	}

	const canAddNewFactors = allFactors.length < MAX_FACTOR_COUNT

	return (
		<div className={"flex flex-col space-y-4"}>
			<FactorsTable factors={allFactors} setUnenrolling={setUnenrolling} />

			<If condition={canAddNewFactors}>
				<SetupMfaButton onClick={onEnrollRequested} />
			</If>

			<If condition={unEnrolling}>
				{(factorId) => (
					<ConfirmUnenrollFactorModal factorId={factorId} setIsModalOpen={() => setUnenrolling(undefined)} />
				)}
			</If>
		</div>
	)
}

function SetupMfaButton(
	props: React.PropsWithChildren<{
		onClick: () => void
	}>,
) {
	const t = useTranslations()

	return (
		<div>
			<Button onClick={props.onClick}>{t("profile.setupMfaButtonLabel")}</Button>
		</div>
	)
}

function ConfirmUnenrollFactorModal(
	props: React.PropsWithChildren<{
		factorId: string
		setIsModalOpen: (isOpen: boolean) => void
	}>,
) {
	const t = useTranslations()
	const unEnroll = useUnenrollFactor()

	const onUnenrollRequested = useCallback(
		async (factorId: string) => {
			if (unEnroll.isMutating) return

			const promise = unEnroll.trigger(factorId).then(() => {
				props.setIsModalOpen(false)
			})

			toast.promise(promise, {
				loading: t("profile.unenrollingFactor"),
				success: t("profile.unenrollFactorSuccess"),
				error: t("profile.unenrollFactorError"),
			})
		},
		[props, t, unEnroll],
	)

	return (
		<Modal
			heading={t("profile.unenrollFactorModalHeading")}
			isOpen={!!props.factorId}
			setIsOpen={props.setIsModalOpen}
		>
			<div className={"flex flex-col space-y-4"}>
				<div className={"text-sm"}>{t("profile.unenrollFactorModalBody")}</div>

				<div className={"flex flex-row justify-end space-x-2"}>
					<Modal.CancelButton disabled={unEnroll.isMutating} onClick={() => props.setIsModalOpen(false)} />

					<Button
						type={"button"}
						loading={unEnroll.isMutating}
						variant={"destructive"}
						onClick={() => onUnenrollRequested(props.factorId)}
					>
						{t("profile.unenrollFactorModalButtonLabel")}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

function FactorsTable({
	setUnenrolling,
	factors,
}: React.PropsWithChildren<{
	setUnenrolling: (factorId: string) => void
	factors: Factor[]
}>) {
	const t = useTranslations("profile")

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t("factorName")}</TableHead>
					<TableHead>{t("factorType")}</TableHead>
					<TableHead>{t("factorStatus")}</TableHead>

					<TableHead />
				</TableRow>
			</TableHeader>

			<TableBody>
				{factors.map((factor) => (
					<TableRow key={factor.id}>
						<TableCell>
							<span className={"block truncate"}>{factor.friendly_name}</span>
						</TableCell>

						<TableCell>
							<Badge className={"inline-flex uppercase"}>{factor.factor_type}</Badge>
						</TableCell>

						<TableCell>
							<Badge
								className={"inline-flex capitalize"}
								color={factor.status === "verified" ? "success" : "normal"}
							>
								{factor.status}
							</Badge>
						</TableCell>

						<TableCell className={"flex justify-end"}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button onClick={() => setUnenrolling(factor.id)}>
										<CrossIcon className={"h-4"} />
									</Button>
								</TooltipTrigger>

								<TooltipContent>{t("unenrollTooltip")}</TooltipContent>
							</Tooltip>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

function useUnenrollFactor() {
	const client = useSupabase()
	const key = useFactorsMutationKey()

	return useMutation(key, async (_, { arg: factorId }: { arg: string }) => {
		const { data, error } = await client.auth.mfa.unenroll({
			factorId,
		})

		if (error) {
			throw error
		}

		return data
	})
}

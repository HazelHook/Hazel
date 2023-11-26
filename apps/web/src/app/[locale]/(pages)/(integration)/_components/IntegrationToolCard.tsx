"use client"

import React, { useState } from "react"
import {
	INTEGRATIONS,
	INTEGRATION_CATEGORIES,
	INTEGRATION_FEATURES,
	IntegrationTool,
	IntegrationTools,
} from "@hazel/integrations/web"
import { DatabaseIcon, ShieldCheckIcon } from "@hazel/icons"
import { Badge } from "@hazel/ui/badge"
import { Card } from "@hazel/ui/card"
import { Dialog, DialogContent, DialogHeader } from "@hazel/ui/dialog"
import { Separator } from "@hazel/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@hazel/ui/tooltip"

import { NewIntegrationForm } from "@/components/forms/integration/create-integration-form"

const IntegrationFeatureIcon = (props: { slug: string; className: string }) =>
	({
		authentication: <ShieldCheckIcon {...props} />,
		database: <DatabaseIcon {...props} />,
	})[props.slug] || null

export const IntegrationToolCard = ({
	integrationKey,
}: {
	integrationKey: IntegrationTools
}) => {
	const integration = INTEGRATIONS[integrationKey]

	const { slug, name, subtitle, categories, features, disabled } = integration

	const [coords, setCoords] = useState({ x: 50, y: 50 })
	const [modalOpen, setModalOpen] = useState<boolean>(false)

	const borderStyle = {
		background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(190, 190, 210, 0.03), transparent)`,
	}

	return (
		<>
			<Card
				className={`group w-full h-full cursor-pointer select-none shadow-sm transition-all hover:shadow-gray-200 ${
					disabled && "opacity-50"
				}`}
				onMouseMove={() => setCoords({ x: 50, y: 50 })}
				onMouseDown={() => setModalOpen(true)}
				style={borderStyle}
			>
				<div className="border p-4 rounded-md h-full flex flex-col ">
					<div className="flex">
						<div className="h-7 flex gap-4 mb-auto">
							<img src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
							<p className="font-semibold">{name}</p>
						</div>
						<div className="flex ml-auto gap-2">
							{features?.map((feature) => (
								<TooltipProvider key={feature}>
									<Tooltip delayDuration={100}>
										<TooltipTrigger>
											<IntegrationFeatureIcon slug={feature} className="w-4 h-4" />
										</TooltipTrigger>
										<TooltipContent sideOffset={5}>
											<div className="flex flex-col gap-1">
												<div className="flex flex-row h-full gap-2 items-center">
													<IntegrationFeatureIcon slug={feature} className="w-4 h-4" />
													<p className="text-sm font-semibold">
														{INTEGRATION_FEATURES[feature].name}
													</p>
												</div>
												<p className="text-xs text-muted-foreground ml-6">
													{INTEGRATION_FEATURES[feature].description}
												</p>
											</div>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							))}
						</div>
					</div>
					<div className="mt-2 mb-2">
						<p className="text-sm text-muted-foreground">{subtitle}</p>
					</div>
					<div className="flex gap-2 mt-auto ml-auto">
						{categories.map((category) => (
							<Badge
								variant="outline"
								key={`badge-${category}`}
								className="transition-all group-hover:shadow-badgeHover"
							>
								{INTEGRATION_CATEGORIES[category].name}
							</Badge>
						))}
					</div>
				</div>
			</Card>

			{integration.config && !integration.disabled ? (
				<Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
					<DialogContent className="flex flex-col justify-center items-center">
						<DialogHeader className="w-full">
							<div className="flex flex-row gap-4 ml-1 mr-1 justify-start w-full">
								<img src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
								<h3>Add {name} Integration</h3>
							</div>
						</DialogHeader>

						<Separator />
						<NewIntegrationForm integration={integration} onSuccess={() => setModalOpen(false)} />
					</DialogContent>
				</Dialog>
			) : null}
		</>
	)
}

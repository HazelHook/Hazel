"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import * as Tooltip from "@radix-ui/react-tooltip"
import React, { useRef, useState } from "react"
import {
	INTEGRATIONS,
	INTEGRATION_CATERGORIES,
	INTEGRATION_FEATURES,
	Integration,
} from "@/app/(pages)/(integration)/integrations/data"
import { Dialog, DialogContent, DialogPortal, Portal, Root, Trigger } from "@radix-ui/react-dialog"
import { IntegrationFormModal } from "@/app/(pages)/(integration)/integrations/form"
import { Separator } from "@/components/ui/separator"
import { MinusIcon } from "@/components/icons/pika/minus"

export const IntegrationCard = ({ slug, name, subtitle, categories, features, form }: Integration) => {
	const [coords, setCoords] = useState({ x: 50, y: 50 })
	const [isHovered, setIsHovered] = useState(false)
	const [isSourceModalOpen, setSourceModalOpen] = useState(false)
	const cardRef = useRef(null)

	const handleMouseMove = (e: any) => {
		if (cardRef.current) {
			const rect = (cardRef.current as any).getBoundingClientRect()
			const x = ((e.clientX - rect.left) / rect.width) * 100
			const y = ((e.clientY - rect.top) / rect.height) * 100
			setCoords({ x, y })
		}
	}

	const borderStyle = {
		background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(190, 190, 210, 0.03), transparent)`,
	}

	return (
		<>
			<Root open={isSourceModalOpen} onOpenChange={setSourceModalOpen}>
				<Trigger asChild>
					<Card
						className="w-full h-full overflow-hidden cursor-pointer select-none shadow-sm transition-all shadow-gray-500 hover:shadow-gray-200"
						onMouseMove={handleMouseMove}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						style={borderStyle}
						ref={cardRef}
					>
						<div className="border p-4 rounded-md h-full flex flex-col ">
							<div className="flex">
								<div className="h-7 flex gap-4 mb-auto">
									<img src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
									<p className="font-semibold">{name}</p>
								</div>
								<div className="flex ml-auto gap-2">
									{features?.map((feature) => (
										<Tooltip.Provider delayDuration={200} key={feature}>
											<Tooltip.Root>
												<Tooltip.Trigger asChild>
													{React.cloneElement(
														INTEGRATION_FEATURES[feature].icon({
															className: "w-4 h-4",
														}),
													)}
												</Tooltip.Trigger>
												<Tooltip.Portal>
													<Tooltip.Content className="TooltipContent" sideOffset={5}>
														<Card className="p-2">
															<div className="flex flex-col gap-1">
																<div className="flex flex-row h-full gap-2 items-center">
																	{React.cloneElement(
																		INTEGRATION_FEATURES[feature].icon({
																			className: "w-4 h-4",
																		}),
																	)}
																	<p className="text-sm font-semibold">{INTEGRATION_FEATURES[feature].name}</p>
																</div>
																<p className="text-xs text-gray-400 ml-6">
																	{INTEGRATION_FEATURES[feature].description}
																</p>
															</div>
														</Card>
														<Tooltip.Arrow className="TooltipArrow" />
													</Tooltip.Content>
												</Tooltip.Portal>
											</Tooltip.Root>
										</Tooltip.Provider>
									))}
								</div>
							</div>
							<div className="mt-2 mb-2">
								<p className="text-sm text-gray-400">{subtitle}</p>
							</div>
							<div className="flex gap-2 mt-auto ml-auto">
								{categories.map((category) => (
									<Badge
										variant="outline"
										key={`badge-${category}`}
										className="transition-all"
										style={
											isHovered
												? {
														boxShadow: "0 0 0 1px rgba(190, 190, 210, 0.15)",
												  }
												: {}
										}
									>
										{INTEGRATION_CATERGORIES[category].name}
									</Badge>
								))}
							</div>
						</div>
					</Card>
				</Trigger>
				<Portal>
					{form ? (
						<DialogContent className="absolute w-full h-full m-0 p-0 top-0 left-0 flex justify-center items-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
							<Card className="relative w-3/12 p-4 flex flex-col gap-3">
								<div className="flex flex-row gap-4 ml-1 mr-1">
									<img src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
									<h3>Add {name} Integration</h3>
									<MinusIcon className="w-5 h-5 ml-auto"/>
								</div>
								<Separator />
								<IntegrationFormModal integration={form} />
							</Card>
						</DialogContent>
					) : null}
				</Portal>
			</Root>
		</>
	)
}

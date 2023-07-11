"use client"

import { Card } from "@/components/ui/card"
import { Integration } from "@/app/(pages)/(integration)/integrations/page"
import { Badge } from "@/components/ui/badge"
import React, { useRef, useState } from "react"
import { INTEGRATION_CATERGORIES, INTEGRATION_FEATURES } from "@/app/(pages)/(integration)/_statics"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Arrow } from "@radix-ui/react-tooltip"
import { Image } from "@/components/ui/image"

export const IntegrationCard = ({ slug, name, subtitle, categories, features }: Integration) => {
	const [coords, setCoords] = useState({ x: 50, y: 50 })
	const [isHovered, setIsHovered] = useState(false)
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
		background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(190, 190, 210, 0.02), transparent)`,
	}

	return (
		<Card
			className="w-full h-full overflow-hidden cursor-pointer select-none shadow-sm transition-all hover:shadow-gray-300"
			onMouseMove={handleMouseMove}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={borderStyle}
			ref={cardRef}
		>
			<div className="border p-4 rounded-md h-full flex flex-col ">
				<div className="flex flex-row justify-between">
					<div className="flex gap-4">
						<Image layout="fullWidth" src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
						<p className="font-semibold">{name}</p>
					</div>
					<div className="flex gap-2">
						{features?.map((feature) => (
							<TooltipProvider delayDuration={200} key={feature}>
								<Tooltip>
									<TooltipTrigger asChild>
										{INTEGRATION_FEATURES[feature].icon({
											className: "w-4 h-4",
										})}
									</TooltipTrigger>
									<TooltipContent sideOffset={5}>
										<div className="flex flex-col gap-1">
											<div className="flex flex-row h-full gap-2 items-center">
												{INTEGRATION_FEATURES[feature].icon({
													className: "w-4 h-4",
												})}
												<p className="text-sm font-semibold">{INTEGRATION_FEATURES[feature].name}</p>
											</div>
											<p className="text-xs text-muted-foreground ml-6">{INTEGRATION_FEATURES[feature].description}</p>
										</div>
										<Arrow />
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
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
	)
}

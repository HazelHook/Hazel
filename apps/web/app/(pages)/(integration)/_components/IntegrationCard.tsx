"use client"

import React, { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ShieldCheckIcon } from "@/components/icons/pika/shieldCheck"
import { DatabaseIcon } from "@/components/icons/pika/database"
import { IconProps } from "@/components/icons/pika/types"
import { MinusIcon } from "@/components/icons/pika/minus"
import { Separator } from "@/components/ui/separator"
import * as Tooltip from "@radix-ui/react-tooltip"
import * as Dialog from "@radix-ui/react-dialog"
import { NewIntegrationForm } from "@/app/(pages)/(integration)/_components/NewIntegrationForm"
import { INTEGRATION_CATERGORIES, INTEGRATION_FEATURES } from "db/src/drizzle/integrations/data"
import { IntegrationTool } from "db/src/drizzle/integrations/common"

const IntegrationFeatureIcon = (props: { slug: string, className: string }) =>
	({
		authentication: <ShieldCheckIcon {...props} />,
		database: <DatabaseIcon {...props} />,
	})[props.slug] || null

export const IntegrationCard = ({ integration }: { integration: IntegrationTool }) => {
	const { slug, name, subtitle, categories, features } = integration

	const [coords, setCoords] = useState({ x: 50, y: 50 })
	const [isHovered, setIsHovered] = useState(false)
	const [modalOpen, setModalOpen] = useState<boolean>(false)

	// 	return (
	// 		<Card
	// 			className="w-full h-full overflow-hidden cursor-pointer select-none shadow-sm transition-all hover:shadow-gray-300"
	// 			onMouseMove={handleMouseMove}
	// 			onMouseEnter={() => setIsHovered(true)}
	// 			onMouseLeave={() => setIsHovered(false)}
	// 			style={borderStyle}
	// 			ref={cardRef}
	// 		>
	// 			<div className="border p-4 rounded-md h-full flex flex-col ">
	// 				<div className="flex flex-row justify-between">
	// 					<div className="flex gap-4">
	// 						<Image layout="fullWidth" src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
	// 						<p className="font-semibold">{name}</p>
	// 					</div>
	// 					<div className="flex gap-2">
	// 						{features?.map((feature) => (
	// 							<TooltipProvider delayDuration={200} key={feature}>
	// 								<Tooltip>
	// 									<TooltipTrigger asChild>
	// 										{INTEGRATION_FEATURES[feature].icon({
	// 											className: "w-4 h-4",
	// 										})}
	// 									</TooltipTrigger>
	// 									<TooltipContent sideOffset={5}>
	// 										<div className="flex flex-col gap-1">
	// 											<div className="flex flex-row h-full gap-2 items-center">
	// 												{INTEGRATION_FEATURES[feature].icon({
	// 													className: "w-4 h-4",
	// 												})}
	// 												<p className="text-sm font-semibold">{INTEGRATION_FEATURES[feature].name}</p>
	// 											</div>
	// 											<p className="text-xs text-muted-foreground ml-6">{INTEGRATION_FEATURES[feature].description}</p>
	// 										</div>
	// 										<Arrow />
	// 									</TooltipContent>
	// 								</Tooltip>
	// 							</TooltipProvider>
	// 						))}
	// 					</div>
	// 				</div>
	// 				<div className="mt-2 mb-2">
	// 					<p className="text-sm text-gray-400">{subtitle}</p>
	// 				</div>
	// 				<div className="flex gap-2 mt-auto ml-auto">
	// 					{categories.map((category) => (
	// 						<Badge
	// 							variant="outline"
	// 							key={`badge-${category}`}
	// 							className="transition-all"
	// 							style={
	// 								isHovered
	// 									? {
	// 											boxShadow: "0 0 0 1px rgba(190, 190, 210, 0.15)",
	// 									  }
	// 									: {}
	// 							}
	// 						>
	// 							{INTEGRATION_CATERGORIES[category].name}
	// 						</Badge>
	// 					))}
	// 				</div>
	// 			</div>
	// 		</Card>
	// 	)
	// }

	const borderStyle = {
		background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(190, 190, 210, 0.03), transparent)`,
	}

	return (
		<>
			<Card
				className="w-full h-full overflow-hidden cursor-pointer select-none shadow-sm transition-all shadow-gray-500 hover:shadow-gray-200"
				onMouseMove={() => setCoords({ x: 50, y: 50 })}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onMouseUp={() => setModalOpen(true)}
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
								<Tooltip.Provider delayDuration={200} key={feature}>
									<Tooltip.Root>
										<Tooltip.Trigger asChild>
											<IntegrationFeatureIcon slug={feature} className="w-4 h-4" />
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content className="TooltipContent" sideOffset={5}>
												<Card className="p-2">
													<div className="flex flex-col gap-1">
														<div className="flex flex-row h-full gap-2 items-center">
															<IntegrationFeatureIcon slug={feature} className="w-4 h-4" />
															<p className="text-sm font-semibold">{INTEGRATION_FEATURES[feature].name}</p>
														</div>
														<p className="text-xs text-gray-400 ml-6">{INTEGRATION_FEATURES[feature].description}</p>
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

			{integration.config ? (
				<Dialog.Root open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
					<Dialog.Content
						className="absolute w-screen h-screen m-0 p-0 top-0 left-0 flex justify-center items-center z-50"
						style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
						// onMouseDown={() => setModalOpen(false)}
					>
						<Card
							className="relative max-w-screen-sm p-4 flex flex-col gap-3 select-none"
							onMouseDown={(e) => e.stopPropagation()}
						>
							<div className="flex flex-row gap-4 ml-1 mr-1">
								<img src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
								<h3>Add {name} Integration</h3>
								<div className="w-5 h-5 ml-auto" onMouseDown={() => setModalOpen(false)}>
									<MinusIcon className="w-5 h-5 hover:bg-g hover:bg-opacity-20 hover:bg-white rounded" />
								</div>
							</div>
							<Separator />
							<NewIntegrationForm integration={integration} onClose={() => setModalOpen(false)} />
						</Card>
					</Dialog.Content>
				</Dialog.Root>
			) : null}
		</>
	)
}

//   const borderStyle = {
//     background: `radial-gradient(circle at ${coords.x}% ${coords.y}%, rgba(190, 190, 210, 0.03), transparent)`,
//   };

//   return (
//     <>
//       <Root open={isModalOpen}>
//         <Trigger asChild>
//           <Card
//             className="w-full h-full overflow-hidden cursor-pointer select-none shadow-sm transition-all shadow-gray-500 hover:shadow-gray-200"
//             onMouseMove={handleMouseMove}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//             onMouseUp={() => setModalOpen(true)}
//             style={borderStyle}
//             ref={cardRef}
//           >
//             <div className="border p-4 rounded-md h-full flex flex-col ">
//               <div className="flex">
//                 <div className="h-7 flex gap-4 mb-auto">
//                   <img
//                     src={`/assets/integrations/${slug}.svg`}
//                     alt={slug}
//                     className="w-7 h-7"
//                   />
//                   <p className="font-semibold">{name}</p>
//                 </div>
//                 <div className="flex ml-auto gap-2">
//                   {features?.map((feature) => (
//                     <Tooltip.Provider delayDuration={200} key={feature}>
//                       <Tooltip.Root>
//                         <Tooltip.Trigger asChild>
//                           {React.cloneElement(
//                             INTEGRATION_FEATURES[feature].icon({
//                               className: "w-4 h-4",
//                             }),
//                           )}
//                         </Tooltip.Trigger>
//                         <Tooltip.Portal>
//                           <Tooltip.Content
//                             className="TooltipContent"
//                             sideOffset={5}
//                           >
//                             <Card className="p-2">
//                               <div className="flex flex-col gap-1">
//                                 <div className="flex flex-row h-full gap-2 items-center">
//                                   {React.cloneElement(
//                                     INTEGRATION_FEATURES[feature].icon({
//                                       className: "w-4 h-4",
//                                     }),
//                                   )}
//                                   <p className="text-sm font-semibold">
//                                     {INTEGRATION_FEATURES[feature].name}
//                                   </p>
//                                 </div>
//                                 <p className="text-xs text-gray-400 ml-6">
//                                   {INTEGRATION_FEATURES[feature].description}
//                                 </p>
//                               </div>
//                             </Card>
//                             <Tooltip.Arrow className="TooltipArrow" />
//                           </Tooltip.Content>
//                         </Tooltip.Portal>
//                       </Tooltip.Root>
//                     </Tooltip.Provider>
//                   ))}
//                 </div>
//               </div>
//               <div className="mt-2 mb-2">
//                 <p className="text-sm text-gray-400">{subtitle}</p>
//               </div>
//               <div className="flex gap-2 mt-auto ml-auto">
//                 {categories.map((category) => (
//                   <Badge
//                     variant="outline"
//                     key={`badge-${category}`}
//                     className="transition-all"
//                     style={
//                       isHovered
//                         ? {
//                             boxShadow: "0 0 0 1px rgba(190, 190, 210, 0.15)",
//                           }
//                         : {}
//                     }
//                   >
//                     {INTEGRATION_CATERGORIES[category].name}
//                   </Badge>
//                 ))}
//               </div>
//             </div>
//           </Card>
//         </Trigger>
//         <Portal>
//         {form ? (
//             <DialogContent
//               className="absolute w-screen h-screen m-0 p-0 top-0 left-0 flex justify-center items-center z-50"
//               style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
//               onMouseDown={() => setNewIntegrationModal(null)}
//             >
//               <Card
//                 className="relative max-w-screen-sm p-4 flex flex-col gap-3 select-none"
//                 onMouseDown={(e) => e.stopPropagation()}
//               >
//                 <div className="flex flex-row gap-4 ml-1 mr-1">
//                   <img
//                     src={`/assets/integrations/${slug}.svg`}
//                     alt={slug}
//                     className="w-7 h-7"
//                   />
//                   <h3>Add {name} Integration</h3>
//                   <div
//                     className="w-5 h-5 ml-auto"
//                     onMouseDown={() => setNewIntegrationModal(null)}
//                   >
//                     <MinusIcon className="w-5 h-5 hover:bg-g hover:bg-opacity-20 hover:bg-white rounded" />
//                   </div>
//                 </div>
//                 <Separator />
//                 <IntegrationFormModal integration={form} onSubmit={() => setNewIntegrationModal(null)} />
//               </Card>
//             </DialogContent>
//           ) : null}
//         </Portal>
//       </Root>
//     </>
//   );
// };

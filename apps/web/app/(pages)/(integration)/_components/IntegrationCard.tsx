"use client"

import React, { useRef, useState } from "react"
import * as Tooltip from "@radix-ui/react-tooltip"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { notFound, useRouter } from "next/navigation"
import { getCachedIntegrationTool } from "@/lib/orm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAction } from "@/server/client"
import { createIntegrationAction } from "@/app/(pages)/(integration)/integrations/_actions"
import { ShieldCheckIcon } from "@/components/icons/pika/shieldCheck"
import { DatabaseIcon } from "@/components/icons/pika/database"
import { INTEGRATION_CATERGORIES, INTEGRATION_FEATURES, createIntegrationForm } from "db/src/drizzle/integrations"
import { IconProps } from "@/components/icons/pika/types"
import { Integration } from "db/src/drizzle/integrations/types"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MinusIcon } from "@/components/icons/pika/minus"
import { Separator } from "@/components/ui/separator"
import { Form, FormMessage } from "@/components/ui/form"
import { IntegrationField } from "@/app/(pages)/(integration)/_components/IntegrationField"
import { LabeledSeparator } from "@/components/LabeledSeparator"
import { Button } from "@/components/ui/button"

const IntegrationFeatureIcon = (props: IconProps & {slug: string}) => ({
	authentication: <ShieldCheckIcon {...props}/>,
	database: <DatabaseIcon {...props}/>,
})[props.slug] || null

export const IntegrationCard = async ({
	integration: { slug, name, subtitle, categories, features },
}: { integration: Integration }) => {
	const router = useRouter()

	const [coords, setCoords] = useState({ x: 50, y: 50 })
	const [isHovered, setIsHovered] = useState(false)
	const [newIntegrationModal, setNewIntegrationModal] = useState<string | null>(null)
	const cardRef = useRef(null)

	const integrationTool = await getCachedIntegrationTool({ slug: slug })
	if (!integrationTool) {
		notFound()
	}

	const formSchema = createIntegrationForm({
		name: integrationTool.name,
		schema: JSON.parse(integrationTool.schema),
	})

	const form = useForm<typeof formSchema>({
		resolver: zodResolver(z.object(formSchema.config)),
		defaultValues: Object.keys(formSchema.config).reduce((acc, key) => {
			(acc as any)[key] = ""
			return acc
		}, {}) as any,
	})

	const createIntegration = useAction(createIntegrationAction, {
		onSuccess(data) {
		},
		onError(error) {
			form.setError("root", error)
		},
	})

	function onSubmit(values: typeof formSchema) {
		createIntegration.mutate({
			data: values,
			name: values.name!,
		})
	}

	const handleMouseMove = (e: any) => {
		if (cardRef.current) {
			const rect = (cardRef.current as any).getBoundingClientRect()
			const x = ((e.clientX - rect.left) / rect.width) * 100
			const y = ((e.clientY - rect.top) / rect.height) * 100
			setCoords({ x, y })
		}
	}

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

			<Dialog open={newIntegrationModal !== null} onOpenChange={() => setNewIntegrationModal(null)}>
				<DialogContent
					className="absolute w-screen h-screen m-0 p-0 top-0 left-0 flex justify-center items-center z-50"
					style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
					onMouseDown={() => setNewIntegrationModal(null)}
				>
					<Card
						className="relative max-w-screen-sm p-4 flex flex-col gap-3 select-none"
						onMouseDown={(e) => e.stopPropagation()}
					>
						<div className="flex flex-row gap-4 ml-1 mr-1">
							<img src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
							<h3>Add {name} Integration</h3>
							<div className="w-5 h-5 ml-auto" onMouseDown={() => setNewIntegrationModal(null)}>
								<MinusIcon className="w-5 h-5 hover:bg-g hover:bg-opacity-20 hover:bg-white rounded" />
							</div>
						</div>
						<Separator />
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
								{Object.entries(formSchema.general).map(([key, config]) => {
									return <IntegrationField fieldDef={config} pathKey={key} form={form as any} key={key} />
								})}
								<LabeledSeparator label="Configuration" className="mt-6 mb-4" />
								{Object.entries(formSchema.fields).map(([key, integField]) => {
									return <IntegrationField fieldDef={integField as any} pathKey={key} form={form as any} key={key} />
								})}
								<FormMessage />

								<Button
									type="submit"
									disabled={createIntegration.status === "loading"}
									loading={createIntegration.status === "loading"}
								>
									Create
								</Button>
							</form>
						</Form>
					</Card>
				</DialogContent>
			</Dialog>
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

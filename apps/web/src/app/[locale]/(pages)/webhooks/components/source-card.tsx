"use client"

import { CopyButton } from "@/components/copy-button"
import { UpdateIntegrationForm } from "@/components/forms/integration/update-integration-form"
import { updateSourceSchema } from "@/lib/schemas/source"
import { updateIntegrationAction } from "@/server/actions/integrations"
import { deleteSourceAction, updateSourceAction } from "@/server/actions/source"
import { Integration } from "@hazel/db"
import { DeleteAltIcon, ExternalLink01Icon, LogInLeftIcon, ThreeDotsHorizontalIcon } from "@hazel/icons"
import { INTEGRATIONS, IntegrationTools } from "@hazel/integrations/web"
import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { Button, buttonVariants } from "@hazel/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@hazel/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@hazel/ui/dropdown-menu"
import { Label } from "@hazel/ui/label"
import { LoadingButton } from "@hazel/ui/loading-button"

import { Popover, PopoverContent, PopoverTrigger } from "@hazel/ui/popover"
import { Separator } from "@hazel/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type SourceCardProps = {
	id: string
	name: string
	integration: Integration | null
}

export const SourceCard = ({ name, id, integration }: SourceCardProps) => {
	const router = useRouter()

	const handleDelete = useAction(deleteSourceAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	const handleUpdate = useAction(updateSourceAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={
						"rounded-lg border bg-card text-card-foreground shadow-sm  p-2 w-full flex flex-row items-center gap-2 group-hover:border-muted-foreground"
					}
				>
					{integration ? (
						<img
							src={`/assets/integrations/${integration?.tool}.svg`}
							alt={integration?.tool}
							className="mr-2 w-4"
						/>
					) : (
						<LogInLeftIcon className="w-4 h-4 text-muted-foreground" />
					)}
					{name}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="flex flex-col gap-4 max-w-full">
					<div className="flex justify-between items-start">
						<div className="flex gap-2">
							<LogInLeftIcon className="w-4 h-4" />
							<h4 className="font-medium leading-none">Source</h4>
						</div>
						{/* TODO: ADD DELETE SETTING HERE  */}
						<DropdownMenu>
							<DropdownMenuTrigger>
								<ThreeDotsHorizontalIcon />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className="text-destructive"
									onClick={async () => {
										toast.promise(() => handleDelete.mutateAsync(id), {
											loading: "Deleting Source...",
											success: "Successfully deleted the Source",
											error: "There was an error deleting the Source",
										})
									}}
								>
									<DeleteAltIcon className="w-4 h-4 mr-1" />
									<p>Delete Source</p>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<AutoForm
						onSubmit={async (values) => {
							return await handleUpdate.mutateAsync({ ...values, publicId: id })
						}}
						defaultValues={{ name }}
						formSchema={updateSourceSchema.omit({ publicId: true, integrationId: true })}
					>
						{integration && (
							<div className="flex flex-col gap-2">
								<Label className="ml-1">Integration</Label>
								<Dialog>
									<DialogContent>
										<UpdateIntegrationForm
											data={integration}
											integration={INTEGRATIONS[integration.tool as IntegrationTools]}
											updateAction={updateIntegrationAction}
										/>
									</DialogContent>
									<DialogTrigger asChild>
										<Button type="button" variant="outline" className="justify-start">
											<img
												src={`/assets/integrations/${integration?.tool}.svg`}
												alt={integration?.tool}
												className="mr-2 w-5"
											/>
											{INTEGRATIONS[integration.tool as IntegrationTools].name}
										</Button>
									</DialogTrigger>
								</Dialog>
							</div>
						)}
						<Separator className="-mx-4" />
						<div className="flex flex-col gap-2">
							<Label className="ml-1">Source Url</Label>
							<CopyButton
								value={`${process.env.NEXT_PUBLIC_HAZEL_BACKEND_URL}/v1/hook/${id}`}
								display={`${process.env.NEXT_PUBLIC_HAZEL_BACKEND_URL}/v1/hook/${id}`.replace(
									"https://",
									"",
								)}
							/>
						</div>
						<Separator className="-mx-4" />
						<div className="flex flex-row justify-between">
							<Link href={`/source/${id}`} className={buttonVariants({ variant: "outline" })}>
								<ExternalLink01Icon className="mr-2 w-4 h-4" />
								Open Source
							</Link>
							<LoadingButton loading={handleUpdate.status === "loading"}>Update</LoadingButton>
						</div>
					</AutoForm>
				</div>
			</PopoverContent>
		</Popover>
	)
}

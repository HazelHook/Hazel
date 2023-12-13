"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { deleteDestinationAction, updateDestinationAction } from "@/server/actions/destination"
import { updateDestinationSchema } from "@/lib/schemas/destination"

import { useAction } from "@hazel/server/actions/client"
import { AutoForm } from "@hazel/ui/auto-form"
import { buttonVariants } from "@hazel/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@hazel/ui/dropdown-menu"
import { LoadingButton } from "@hazel/ui/loading-button"
import { Popover, PopoverContent, PopoverTrigger } from "@hazel/ui/popover"
import { Separator } from "@hazel/ui/separator"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import { IconDotsVertical } from "@tabler/icons-react"
import { Destination } from "@hazel/db"

export type DestinationCardProps = { destination: Destination }
export const DestinationCard = ({ destination: { publicId, name, ...rest } }: DestinationCardProps) => {
	const router = useRouter()

	const handleDelete = useAction(deleteDestinationAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	const handleUpdate = useAction(updateDestinationAction, {
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
					<Icons.Destination className="w-4 h-4 text-muted-foreground" />

					{name}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="flex flex-col gap-4 max-w-full">
					<div className="flex justify-between items-start">
						<div className="flex gap-2">
							<Icons.Destination className="w-4 h-4" />
							<h4 className="font-medium leading-none">Destination</h4>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<IconDotsVertical />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className="text-destructive"
									onClick={async () => {
										toast.promise(() => handleDelete.mutateAsync(publicId), {
											loading: "Deleting Source...",
											success: "Successfully deleted the Source",
											error: "There was an error deleting the Source",
										})
									}}
								>
									<Icons.Delete className="w-4 h-4 mr-1" />
									<p>Delete Destination</p>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<AutoForm
						onSubmit={async (values) => {
							return await handleUpdate.mutateAsync({
								...values,
								publicId: publicId,
							})
						}}
						defaultValues={{ name, ...rest }}
						formSchema={updateDestinationSchema}
					>
						<Separator className="-mx-4" />
						<div className="flex flex-row gap-2 justify-between">
							<Link href={`/destination/${publicId}`} className={buttonVariants({ variant: "outline" })}>
								<Icons.Destination className="mr-2 w-4 h-4" />
								Open Destination
							</Link>
							<LoadingButton type="submit" loading={handleUpdate.status === "loading"}>
								Update
							</LoadingButton>
						</div>
					</AutoForm>
				</div>
			</PopoverContent>
		</Popover>
	)
}

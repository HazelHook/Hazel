"use client"

import {
	AutomationIcon,
	DeleteAltIcon,
	ExternalLink01Icon,
	LinkChainIcon,
	Settings02Icon,
	ThreeDotsHorizontalIcon,
	TimerIcon,
} from "@hazel/icons"
import { AutoForm } from "@hazel/ui/auto-form"
import { Button, buttonVariants } from "@hazel/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@hazel/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@hazel/ui/popover"
import { Separator } from "@hazel/ui/separator"
import Link from "next/link"
import { updateConnectionSchema } from "@/lib/schemas/connection"
import { useAction } from "@hazel/server/actions/client"
import { deleteConnectionAction, updateConnectionAction } from "@/server/actions/connections"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export type ConnectionPathProps = {
	id: string
	name: string | null
	retryType: string | null
	delay: number | null
}

export const ConnectionPath = ({ retryType, delay, id, name }: ConnectionPathProps) => {
	const router = useRouter()

	const handleDeleteConnection = useAction(deleteConnectionAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	const handleUpdateConnection = useAction(updateConnectionAction, {
		onSuccess: () => {
			router.refresh()
		},
	})

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="w-full flex items-center h-10 cursor-pointer">
					<div className="w-full flex justify-between items-center h-0.5 bg-border group-hover:bg-muted-foreground relative">
						<div />
						<Button size="none" className="p-1 mr-4 group-hover:border-muted-foreground">
							{retryType && <AutomationIcon className="w-4 h-4" />}

							{delay && <TimerIcon className="w-4 h-4" />}

							{!retryType && !delay && <Settings02Icon className="w-4 h-4" />}
						</Button>
					</div>
				</div>
			</PopoverTrigger>
			<PopoverContent className="min-w-max">
				<div className="flex flex-col gap-4 max-w-full">
					<div className="flex justify-between items-start">
						<div className="flex gap-2">
							<LinkChainIcon className="w-4 h-4" />
							<h4 className="font-medium leading-none">Connection</h4>
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
										toast.promise(() => handleDeleteConnection.mutateAsync(id), {
											loading: "Deleting Connection...",
											success: "Successfully deleted the Connection",
											error: "There was an error deleting the Connection",
										})
									}}
								>
									<DeleteAltIcon className="w-4 h-4 mr-1" />
									<p>Delete Connection</p>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<AutoForm
						onSubmit={async (values) => {
							return await handleUpdateConnection.mutateAsync({ ...values, publicId: id })
						}}
						defaultValues={{ name }}
						formSchema={updateConnectionSchema}
					>
						<Separator className="-mx-4" />
						<div className="flex flex-row justify-between gap-2">
							<Link href={`/connection/${id}`} className={buttonVariants({ variant: "outline" })}>
								<ExternalLink01Icon className="mr-2 w-4 h-4" />
								Open Connection
							</Link>
							<Button>Update</Button>
						</div>
					</AutoForm>
				</div>
			</PopoverContent>
		</Popover>
	)
}

import { CopyButton } from "@/components/copy-button"
import {
	DeleteAltIcon,
	ExternalLink01Icon,
	InboxInIcon,
	LogInLeftIcon,
	ThreeDotsCircleHorizontalIcon,
	ThreeDotsHorizontalIcon,
	ThreeDotsSquareHorizontalIcon,
	ThreeDotsVerticalIcon,
} from "@hazel/icons"
import { Button, buttonVariants } from "@hazel/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@hazel/ui/dropdown-menu"
import { Input } from "@hazel/ui/input"
import { Label } from "@hazel/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@hazel/ui/popover"
import { Separator } from "@hazel/ui/separator"
import configuration from "@hazel/utils/configuration"
import Link from "next/link"

type DestinationCardProps = {
	id: string
	name: string
}

export const DestinationCard = ({ name, id }: DestinationCardProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={
						"rounded-lg border bg-card text-card-foreground shadow-sm  p-2 w-full flex flex-row items-center gap-2 group-hover:border-muted-foreground"
					}
				>
					<InboxInIcon className="w-4 h-4 text-muted-foreground" />

					{name}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="flex flex-col gap-4 max-w-full">
					<div className="flex justify-between items-start">
						<div className="flex gap-2">
							<InboxInIcon className="w-4 h-4" />
							<h4 className="font-medium leading-none">Destination</h4>
						</div>
						{/* TODO: ADD DELETE SETTING HERE  */}
						<DropdownMenu>
							<DropdownMenuTrigger>
								<ThreeDotsHorizontalIcon />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem className="text-destructive">
									<DeleteAltIcon className="w-4 h-4 mr-1" />
									<p>Delete Destination</p>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex flex-col gap-2">
						<Label className="ml-1" htmlFor="name">
							Destination Name
						</Label>
						<Input id="name" defaultValue={name} />
					</div>
					<div className="flex flex-col gap-2">
						<Label className="ml-1">Source Url</Label>
						<CopyButton
							value={
								configuration.production
									? `https://api.hazelapp.dev/v1/webhook/${id}`
									: `http://localhost:3003v/v1/webhook/${id}`
							}
						/>
					</div>
					<Separator className="-mx-4" />
					<div className="flex flex-row gap-2 justify-between">
						<Link href={`/destination/${id}`} className={buttonVariants({ variant: "outline" })}>
							<ExternalLink01Icon className="mr-2 w-4 h-4" />
							Open Destination
						</Link>
						<Button>Update</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}

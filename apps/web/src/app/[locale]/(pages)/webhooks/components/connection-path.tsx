import {
	AutomationIcon,
	DeleteAltIcon,
	ExternalLink01Icon,
	LinkChainIcon,
	Settings02Icon,
	ThreeDotsHorizontalIcon,
	TimerIcon,
} from "@hazel/icons"
import { Button, buttonVariants } from "@hazel/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@hazel/ui/dropdown-menu"
import { Input } from "@hazel/ui/input"
import { Label } from "@hazel/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@hazel/ui/popover"
import { Separator } from "@hazel/ui/separator"
import Link from "next/link"

export type ConnectionPathProps = {
	id: string
	name: string | null
	retryType: string | null
	delay: number | null
}

export const ConnectionPath = ({ retryType, delay, id, name }: ConnectionPathProps) => {
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
								<DropdownMenuItem className="text-destructive">
									<DeleteAltIcon className="w-4 h-4 mr-1" />
									<p>Delete Connection</p>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex flex-col gap-2">
						<Label className="ml-1" htmlFor="name">
							Connection Name
						</Label>
						<Input id="name" defaultValue={name || ""} />
					</div>

					<Separator className="-mx-4" />
					<div className="flex flex-row justify-between gap-2">
						<Link href={`/connection/${id}`} className={buttonVariants({ variant: "outline" })}>
							<ExternalLink01Icon className="mr-2 w-4 h-4" />
							Open Connection
						</Link>
						<Button>Update</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}

import Link from "next/link"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { LogoIcon } from "@/components/icons/Logo"
import { IconProps } from "@/components/icons/pika/types"

import { SidebarClientItem } from "./SidebarItem"
import { Fragment } from "react"

type SubItem = {
	className?: string
	href: string
	icon: (props: IconProps) => JSX.Element
	endIcon?: (props: IconProps) => JSX.Element
	title: string
	target?: string
	disabled?: boolean
	size?: "default" | "xs" | "sm" | "lg"
}

type Item = {
	title?: string
	items: SubItem[]
}

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
	disableLogo?: boolean
	items: Item[]
}

export const SidebarItem = ({ icon, endIcon, ...rest }: SubItem) => {
	const Icon = icon
	const EndIcon = endIcon

	return (
		<SidebarClientItem
			icon={<Icon className="h-4 w-4 lg:mr-2" />}
			endIcon={EndIcon && <EndIcon className="hidden h-3 w-3 lg:ml-2 lg:block" />}
			{...rest}
		/>
	)
}

export async function Sidebar({ className, disableLogo = false, items, children }: SidebarProps) {
	return (
		<div
			className={cn("flex w-full flex-col justify-between gap-4 border-r", className)}
			style={{ height: "calc(100vh - 4rem)" }}
		>
			<div className="h-full w-full max-w-full space-y-2 pb-4 lg:space-y-4">
				{!disableLogo && (
					<Link className="cursor-pointer" href={"/"}>
						<div className="hidden flex-row items-center gap-2 px-4 py-2 lg:flex">
							<LogoIcon className="h-12 w-12" />

							<h1 className="text-3xl font-semibold tracking-tight">Hazel</h1>
						</div>

						<div className="flex justify-center py-2 lg:hidden">
							<LogoIcon className="h-6 w-6" />
						</div>
					</Link>
				)}

				{items.map((item, index) => (
					<Fragment key={`${item.title}-${index}`}>
						<div className="py-2 lg:px-4">
							{item.title && (
								<h2 className="mb-2 hidden px-2 text-lg font-semibold tracking-tight lg:block">{item.title}</h2>
							)}

							<div className="space-y-1">
								{item.items.map((subItem) => (
									<SidebarItem key={subItem.href} {...subItem} />
								))}
							</div>
						</div>
						{index + 1 !== items.length && <Separator />}
					</Fragment>
				))}
			</div>
			<div className="hidden p-2 lg:block">{children}</div>
		</div>
	)
}

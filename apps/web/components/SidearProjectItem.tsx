import Link from "next/link"
import { Connection } from "db/src/schema"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@/components/icons/ChevronDown"
import { ChevronRightIcon } from "@/components/icons/ChevronRight"
import { DashboardIcon } from "@/components/icons/Dashboard"
import { SettingsIcon } from "@/components/icons/Settings"
import { TvChartIcon } from "@/components/icons/TvChart"

import { SidebarItem } from "./Sidebar"
import { Image } from "./ui/image"

export interface SidebarProjectItemProps {
	project: Connection
	params: {
		slug?: string
		org?: string
	}
}
export const SidebarProjectItem = ({ project, params }: SidebarProjectItemProps) => {
	if (project.publicId === params.slug) {
		return (
			<div>
				<Link href={`/app/${params.org}/${project.publicId}`}>
					<Button variant="ghost" size="sm" className="w-full justify-center font-normal lg:justify-start">
						<ChevronDownIcon className="mr-1 hidden h-5 w-5 text-muted-foreground lg:block" />
						<Image
							layout="fixed"
							width={16}
							height={16}
							alt="profilepicture"
							src={getSeededProfileImageUrl(project.publicId)}
							className="aspect-square rounded-[3px] lg:mr-2"
						/>
						<p className="hidden lg:block">{project.name}</p>
					</Button>
				</Link>
				<div className="lg:ml-6">
					<SidebarItem
						href={`/app/${params.org}/${project.publicId}`}
						title={"Dashboard"}
						icon={DashboardIcon}
						size={"xs"}
					/>
					<SidebarItem
						href={`/app/${params.org}/${project.publicId}/live`}
						title={"Live (WIP)"}
						icon={TvChartIcon}
						size={"xs"}
					/>
					<SidebarItem
						href={`/app/${params.org}/${project.publicId}/settings`}
						title={"Settings"}
						icon={SettingsIcon}
						size={"xs"}
					/>
				</div>
			</div>
		)
	}
	return (
		<Link href={`/app/${params.org}/${project.publicId}`}>
			<Button variant="ghost" size="sm" className="w-full justify-center font-normal lg:justify-start">
				<ChevronRightIcon className="mr-1 hidden h-5 w-5 text-muted-foreground lg:block" />
				<Image
					layout="fixed"
					width={16}
					height={16}
					alt="profilepicture"
					src={getSeededProfileImageUrl(project.publicId)}
					className="aspect-square rounded-[3px] lg:mr-2"
				/>
				<p className="hidden lg:block">{project.name}</p>
			</Button>
		</Link>
	)
}

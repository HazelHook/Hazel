import Link from "next/link"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Icons } from "@/components/icons"

import { Connection } from "@hazel/db/schema"
import { ChevronDownIcon, ChevronRightIcon } from "@hazel/icons"
import { Button } from "@hazel/ui/button"
import { Image } from "@hazel/ui/image"

import { SidebarItem } from "./sidebar"

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
						icon={Icons.dashboard}
						size={"xs"}
					/>
					<SidebarItem
						href={`/app/${params.org}/${project.publicId}/settings`}
						title={"Settings"}
						icon={Icons.settings}
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

"use client"

import { Project } from "db/src/schema"

import { getSeededProfileImageUrl } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface ProjectSelectProps {
	projects: Project[]
}

export const ProjectSelect = ({ projects }: ProjectSelectProps) => {
	return (
		<>
			<p className="text-muted-foreground text-xs mb-1">Project</p>
			<Select defaultValue={projects[0].slug}>
				<SelectTrigger>
					<SelectValue placeholder="Select a project" />
				</SelectTrigger>
				<SelectContent>
					{projects.map((project) => (
						<SelectItem value={project.slug}>
							<div className="flex flex-row gap-2 items-center">
								<Avatar className="w-4 h-4">
									<AvatarImage src={getSeededProfileImageUrl(project.publicId)} />
								</Avatar>
								{project.name.replace("Project", "")}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</>
	)
}

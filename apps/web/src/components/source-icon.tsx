import { cn } from "@/lib/utils"
import { Icons } from "./icons"

export type SourceIconProps = {
	className?: string
	slug?: string
}

export const SourceIcon = ({ className, slug }: SourceIconProps) => {
	if (slug) {
		return <img src={`/assets/integrations/${slug}.svg`} alt={slug} className={cn("w-7 h-7", className)} />
	}

	return <Icons.Source className={cn("w-7 h-7 text-muted-foreground", className)} />
}

"use client"

import { IconMaximize, IconMinimize } from "@tabler/icons-react"
import { useMemo, useState } from "react"

export interface ExpandableListProps {
	maxItems?: number
	title: string
	items: { title: string; description: string }[]
}

export const ExpandableList = ({ title, maxItems = 3, items }: ExpandableListProps) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const shownItems = useMemo(() => (isExpanded ? items : items.slice(0, maxItems)), [items, isExpanded, maxItems])

	return (
		<div className="flex flex-col gap-2 border rounded-md bg-card text-card-foreground">
			<div className="px-3 py-2 border-b text-sm text-muted-foreground">{title}</div>
			<div className="flex flex-col gap-2 @container transition-[height]">
				{shownItems.map((item) => (
					<div className="w-full border-b px-3 py-2" key={item.title}>
						<div className="flex justify-between items-center h-full">
							<p className="font-semibold w-full text-left flex-1">{item.title}</p>
							<p className="text-sm text-ellipsis flex-2">{item.description}</p>
						</div>
					</div>
				))}
			</div>

			{maxItems < items.length && (
				<>
					{isExpanded ? (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							className="w-full px-6 py-3 text-cyan-500 text-sm cursor-pointer flex flex-row items-center gap-2"
							onClick={() => setIsExpanded(false)}
						>
							<IconMinimize className="w-4 h-4" />
							Collapse
						</div>
					) : (
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							className="w-full px-6 py-3 text-cyan-500 text-sm cursor-pointer flex flex-row items-center gap-2"
							onClick={() => setIsExpanded(true)}
						>
							<IconMaximize className="w-4 h-4" />
							{`Expand ${items.length - maxItems} more`}
						</div>
					)}
				</>
			)}
		</div>
	)
}

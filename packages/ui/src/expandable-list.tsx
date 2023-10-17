"use client"

import { useMemo, useState } from "react"

import { Maximize02Icon } from "./icons/pika/maximize02"
import { Minimize02Icon } from "./icons/pika/minimize02"

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
			<div className="px-6 py-3 border-b text-sm text-muted-foreground">{title}</div>
			<div className="flex flex-col gap-2 @container transition-[height]">
				{shownItems.map((item) => (
					<div className="w-full border-b px-4 py-3" key={item.title}>
						<div className="flex flex-row justify-between @md:max-w-xs">
							<p className="font-semibold w-full">{item.title}</p>
							<p className="text-sm text-ellipsis">{item.description}</p>
						</div>
					</div>
				))}
			</div>

			{maxItems < items.length && (
				<>
					{isExpanded ? (
						// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							className="w-full px-6 py-3 text-cyan-500 text-sm cursor-pointer flex flex-row items-center gap-2"
							onClick={() => setIsExpanded(false)}
						>
							<Minimize02Icon className="w-4 h-4" />
							Collapse
						</div>
					) : (
						// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							className="w-full px-6 py-3 text-cyan-500 text-sm cursor-pointer flex flex-row items-center gap-2"
							onClick={() => setIsExpanded(true)}
						>
							<Maximize02Icon className="w-4 h-4" />
							{`Expand ${items.length - maxItems} more`}
						</div>
					)}
				</>
			)}
		</div>
	)
}

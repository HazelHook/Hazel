"use client"

import { Card } from "@hazel/ui/card"
import { Dialog, DialogContent } from "@hazel/ui/dialog"
import { Separator } from "@hazel/ui/separator"
import { IconMinus } from "@tabler/icons-react"

export function DeleteForm({
	onClose,
	slug,
	name,
}: {
	onClose: () => void
	name: string
	slug: string
}) {
	return (
		<Dialog>
			<DialogContent
				className="absolute w-screen h-screen m-0 p-0 top-0 left-0 flex justify-center items-center z-50"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
				onMouseDown={() => onClose()}
			>
				<Card
					className="relative max-w-screen-sm p-4 flex flex-col gap-3 select-none"
					onMouseDown={(e) => e.stopPropagation()}
				>
					<div className="flex flex-row gap-4 ml-1 mr-1">
						<img src={`/assets/integrations/${slug}.svg`} alt={slug} className="w-7 h-7" />
						<h3>Add {name} Integration</h3>
						<div className="w-5 h-5 ml-auto" onMouseDown={() => onClose()}>
							<IconMinus className="w-5 h-5 hover:bg-g hover:bg-opacity-20 hover:bg-white rounded" />
						</div>
					</div>
					<Separator />
				</Card>
			</DialogContent>
		</Dialog>
	)
}

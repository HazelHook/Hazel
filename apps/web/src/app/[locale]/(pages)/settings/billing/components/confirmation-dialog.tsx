import { ReactNode } from "react"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@hazel/ui/alert-dialog"
import { Button } from "@hazel/ui/button"

export interface ConfirmationDialogProps {
	children: ReactNode
	title: string
	description: string
	isLoading?: boolean
	onSubmit: () => void
}
export const ConfirmationDialog = ({ children, title, description, isLoading, onSubmit }: ConfirmationDialogProps) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent className="sm:max-w-[425px]">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button variant="ghost">Cancel</Button>
					</AlertDialogCancel>

					<AlertDialogAction asChild>
						<Button disabled={isLoading} variant="destructive" onClick={onSubmit} loading={isLoading}>
							Delete
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

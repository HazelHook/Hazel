"use client"

import { Close as DialogPrimitiveClose } from "@radix-ui/react-dialog"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog"
import If from "./if"
import { CrossIcon } from "../icons/pika/cross"
import { Button } from "./button"
import { useTranslations } from "next-intl"

type ControlledOpenProps = {
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => unknown
}

type TriggerProps = {
	Trigger?: React.ReactNode
}

type Props = React.PropsWithChildren<
	{
		heading: string | React.ReactNode
		closeButton?: boolean
	} & (ControlledOpenProps | TriggerProps)
>

const Modal: React.FC<Props> & {
	CancelButton: typeof CancelButton
} = ({ closeButton, heading, children, ...props }) => {
	const isControlled = "isOpen" in props
	const useCloseButton = closeButton ?? true
	const Trigger = ("Trigger" in props && props.Trigger) || null

	const DialogWrapper = (wrapperProps: React.PropsWithChildren) =>
		isControlled ? (
			<Dialog
				open={props.isOpen}
				onOpenChange={(open) => {
					if (useCloseButton && !open) {
						props.setIsOpen(false)
					}
				}}
			>
				{wrapperProps.children}
			</Dialog>
		) : (
			<Dialog>{wrapperProps.children}</Dialog>
		)

	return (
		<DialogWrapper>
			<If condition={Trigger}>
				<DialogTrigger asChild>{Trigger}</DialogTrigger>
			</If>

			<DialogContent>
				<div className={"flex flex-col space-y-4"}>
					<div className="flex items-center">
						<DialogTitle className="flex w-full text-xl font-semibold text-current">
							<span className={"max-w-[90%] truncate"}>{heading}</span>
						</DialogTitle>
					</div>

					<div className="relative">{children}</div>

					<If condition={useCloseButton}>
						<DialogPrimitiveClose asChild>
							<Button
								className={"absolute top-0 right-4 flex items-center"}
								onClick={() => {
									if (isControlled) {
										props.setIsOpen(false)
									}
								}}
							>
								<CrossIcon className={"h-6"} />
								<span className="sr-only">Close</span>
							</Button>
						</DialogPrimitiveClose>
					</If>
				</div>
			</DialogContent>
		</DialogWrapper>
	)
}

export default Modal

function CancelButton<Props extends React.ButtonHTMLAttributes<unknown>>(props: Props) {
	const t = useTranslations()
	return (
		<Button type={"button"} data-cy={"close-modal-button"} variant={"ghost"} {...props}>
			{t("common.cancel")}
		</Button>
	)
}

Modal.CancelButton = CancelButton

export { CancelButton }

import { revalidatePath } from "next/cache"

import { currencyFormatter } from "@/lib/formatters"
import { capitalizeFirstLetter, cn } from "@/lib/utils"

import { Button } from "@hazel/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hazel/ui/table"
import { SimpleTooltip } from "@hazel/ui/tooltip"
import { lago } from "@hazel/utils/lago"
import { format } from "date-fns"

import { FormLoadButton } from "./form-load-button"
import { IconFileInvoice } from "@tabler/icons-react"

const PaymentStatus = ({
	status,
}: {
	status: "succeeded" | "failed" | "pending"
}) => {
	const statusMap = {
		failed: "bg-destructive",
		succeeded: "bg-green-600",
		pending: "bg-yellow-600",
	}
	return <div className={cn(["h-3 w-3 rounded-full", statusMap[status]])} />
}

export interface CustomerUsageObjectProps {
	workspaceID: string
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export const InvoiceTable = async ({ workspaceID }: CustomerUsageObjectProps) => {
	const {
		data: { invoices },
	} = await lago.invoices.findAllInvoices({
		external_customer_id: workspaceID,
	})

	const generatePDFAction = (invoiceId: string) => async () => {
		"use server"

		await lago.invoices.downloadInvoice(invoiceId)

		await sleep(3000)

		revalidatePath("/settings/billing")

		return {}
	}

	return (
		<Table className="w-full">
			<TableHeader>
				<TableRow>
					<TableHead>Payment</TableHead>
					<TableHead>Invoice Number</TableHead>
					<TableHead>Amount</TableHead>
					<TableHead>Date</TableHead>
					<TableHead className="text-right">Download</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invoices.map((invoice) => (
					<TableRow key={invoice.lago_id}>
						<TableCell>
							<div className="flex items-center gap-2">
								<PaymentStatus status={invoice.payment_status} />
								{capitalizeFirstLetter(invoice.payment_status)}
							</div>
						</TableCell>
						<TableCell>{invoice.number}</TableCell>
						<TableCell>
							{currencyFormatter(invoice.currency).format(invoice.fees_amount_cents / 100)}
						</TableCell>
						<TableCell>{format(new Date(invoice.issuing_date), "LLL dd, y")}</TableCell>
						<TableCell className="text-right">
							{invoice.file_url && (
								<SimpleTooltip content="Download Invoice">
									<a href={invoice.file_url} target="_blank" download rel="noreferrer">
										<Button variant="outline">
											<IconFileInvoice />
										</Button>
									</a>
								</SimpleTooltip>
							)}
							{!invoice.file_url && (
								<form action={generatePDFAction(invoice.lago_id)}>
									<SimpleTooltip content="Generate a pdf invoice">
										<FormLoadButton />
									</SimpleTooltip>
								</form>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

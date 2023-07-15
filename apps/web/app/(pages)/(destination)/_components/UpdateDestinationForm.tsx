"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { useAction } from "@/server/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { updateDestinationAction } from "@/app/(pages)/(destination)/_actions"
import { formSchema } from "@/app/(pages)/(destination)/destination/new/schema"
import { DestinationsDataRowType } from "@/app/(pages)/(destination)/destinations/page"

export const UpdateDestinationForm = ({
	data,
	updateAction,
	onClose,
}: {
	data: DestinationsDataRowType
	updateAction: typeof updateDestinationAction
	onClose?: (id: string) => void
}) => {
	const router = useRouter()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: data as any,
	})

	const updateDestination = useAction(updateAction, {
		onSuccess() {
			onClose?.(data.publicId)
			router.refresh()
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		toast.promise(updateDestination.mutateAsync({ publicId: data.publicId, ...values }), {
			loading: "Update Destination...",
			success: "Destination Successfully Updated",
			error: "There was an error updating your Destination. Please try again or contact us.",
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Destination ..." {...field} required />
							</FormControl>
							<FormDescription>A name to identify your destination.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="url"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Destination Url</FormLabel>
							<FormControl>
								<Input placeholder="Url" {...field} required />
							</FormControl>
							<FormDescription>HTTP endpoint of your backend or api</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormMessage />

				<div className="flex justify-end">
					<Button
						type="submit"
						disabled={updateDestination.status === "loading"}
						loading={updateDestination.status === "loading"}
					>
						Update
					</Button>
				</div>
			</form>
		</Form>
	)
}

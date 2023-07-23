"use client"

import { ReactNode, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useRouter } from "next/navigation"
import { capitalizeFirstLetter } from "@/lib/utils"

interface CreateOrganizationModalProps {
	children: ReactNode
	orgId: string
}

export const memberRoles = ["basic_member", "guest_member", "admin"]

// TODO: SERVER SIDE ERRORS

const formSchema = z.object({
	email: z.string().email(),
	role: z.enum(["basic_member", "guest_member", "admin"]),
})

export const OrganizationInviteModal = ({ children, orgId }: CreateOrganizationModalProps) => {
	const { user } = useUser()
	const router = useRouter()

	const [open, setOpen] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			role: "basic_member",
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// try {
		// 	const invite = await createOrganizationInviteAction({ ...values, orgId: orgId, inviterUserId: user?.id! })
		// 	toast({
		// 		title: "Invite successfully send",
		// 		description: `${invite.emailAddress} will receive an invite link very shortly!`,
		// 	})
		// 	router.refresh()
		// } catch (error) {
		// 	toast({
		// 		title: "Error sending invite",
		// 		description:
		// 			"You might have send this person already an invite, if you think this is a bug let us know and we will help you shortly!",
		// 	})
		// }
		setOpen(false)
		return
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add member to organization</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-4 py-2 pb-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="col-span-full">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Work Email" {...field} type="email" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{memberRoles.map((role) => (
												<SelectItem key={role} value={role}>
													{capitalizeFirstLetter(role.replace("_", " "))}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>

							<Button
								type="submit"
								disabled={form.formState.isSubmitting || !form.formState.isValid}
								loading={form.formState.isSubmitting}
							>
								Invite
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

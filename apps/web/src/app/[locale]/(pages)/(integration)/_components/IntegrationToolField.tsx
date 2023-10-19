"use client"

import { AnyIntegrationFormField } from "@hazel/db/src/drizzle/integrations/common"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@hazel/ui/form"
import { Input } from "@hazel/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@hazel/ui/select"

import { IntegrationMDText } from "@/app/[locale]/(pages)/(integration)/_components/IntegrationMdText"

export function IntegrationToolField({
	fieldDef,
	pathKey,
	control,
}: {
	fieldDef: AnyIntegrationFormField
	pathKey: any
	control: any
}) {
	if (fieldDef.type === "secret" || fieldDef.type === "text") {
		return (
			<FormField
				control={control}
				name={pathKey}
				key={pathKey}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{fieldDef.label}</FormLabel>
						<FormControl>
							<Input
								placeholder={fieldDef.placeholder}
								type={fieldDef.type === "secret" ? "password" : "text"}
								{...field}
							/>
						</FormControl>
						<FormMessage />
						<div className="font-light text-xs mt-1 ml-2">
							<IntegrationMDText description={fieldDef.description} />
						</div>
					</FormItem>
				)}
			/>
		)
	} else if (fieldDef.type === "select") {
		return (
			<FormField
				name={pathKey}
				control={control}
				key={pathKey}
				render={({ field }) => (
					<FormItem>
						<FormLabel>{fieldDef.label}</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<SelectTrigger>
								<SelectValue placeholder={<p className="text-muted-foreground">Select...</p>} />
							</SelectTrigger>
							<SelectContent>
								{fieldDef.options.map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
						<div className="font-light text-xs mt-1 ml-2">
							<IntegrationMDText description={fieldDef.description} />
						</div>
					</FormItem>
				)}
			/>
		)
	}

	return <></>
}

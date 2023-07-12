import { IntegrationMDText } from "@/app/(pages)/(integration)/_components/IntegrationMdText"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectIcon, SelectPortal } from "@radix-ui/react-select"
import { ChevronDownIcon } from "@/components/icons/pika/chevronDown"
import { AnyIntegrationFormField, IntegrationFields, IntegrationSchemaFromFields } from "db/src/drizzle/integrations/types"

export function IntegrationField<TSchema extends IntegrationFields>({
	fieldDef,
	pathKey,
	form,
}: {
	fieldDef: AnyIntegrationFormField
	pathKey: any
	form: UseFormReturn<IntegrationSchemaFromFields<TSchema>, any, undefined>
}) {
	if (fieldDef.type === "text") {
		return (
			<FormField
				name={pathKey}
				control={form.control}
				key={pathKey}
				render={({field}) => (
					<FormItem className="mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-gray-300">{fieldDef.label}</FormLabel>
							{/* <FormMessage/> */}
						</div>
						<FormControl>
							<Input placeholder={fieldDef.placeholder} {...field as any} />
						</FormControl>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={fieldDef.description} />
						</FormDescription>
					</FormItem>
				)}
			/>
		)
	} else if (fieldDef.type === "secret") {
		return (
			<FormField
				name={pathKey}
				control={form.control}
				key={pathKey}
				render={({field}) => (
					<FormItem className="mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-gray-300">{fieldDef.label}</FormLabel>
							{/* <FormMessage /> */}
						</div>
						<FormControl>
							<Input placeholder={fieldDef.placeholder} {...field as any} type="password" />
						</FormControl>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={fieldDef.description} />
						</FormDescription>
					</FormItem>
				)}
			/>
		)
	} else if (fieldDef.type === "select") {
		return (
			<FormField
				name={pathKey}
				control={form.control}
				key={pathKey}
				render={({field}) => (
					<FormItem className="flex flex-col mb-2">
						<div className="flex justify-between ml-1 mr-1">
							<FormLabel className="font-light text-muted-foreground">{fieldDef.label}</FormLabel>
							{/* <FormMessage /> */}
						</div>
						<Select value={field.value as any} onValueChange={(v) => field.onChange(v as any)}>
							<SelectTrigger className="flex flex-row justify-between p-2 h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground">
								<SelectValue placeholder="Select..." />
								<SelectIcon className="SelectIcon">
									<ChevronDownIcon />
								</SelectIcon>
							</SelectTrigger>
							<SelectPortal>
								<SelectContent>
									{fieldDef.options.map((option) => (
										<SelectItem key={option} value={option}>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</SelectPortal>
						</Select>
						<FormDescription className="font-light ml-2 text-xs">
							<IntegrationMDText description={fieldDef.description} />
						</FormDescription>
					</FormItem>
				)}
			/>
		)
	}

	return <></>
}

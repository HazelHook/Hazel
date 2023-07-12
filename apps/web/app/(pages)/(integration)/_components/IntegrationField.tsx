"use client"

import { IntegrationMDText } from "@/app/(pages)/(integration)/_components/IntegrationMdText"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectPortal } from "@radix-ui/react-select"
import { AnyIntegrationFormField } from "db/src/drizzle/integrations/common"
import * as Form from "@radix-ui/react-form"

export function IntegrationField({
	fieldDef,
	pathKey,
}: {
	fieldDef: AnyIntegrationFormField
	pathKey: any
}) {
	if (fieldDef.type === "text") {
		return (
			<Form.Field name={pathKey} key={pathKey} className="mb-2">
				<div className="flex justify-between m-1 ml-2">
					<Form.Label className="font-light text-muted-foreground">{fieldDef.label}</Form.Label>
					{/* <FormMessage/> */}
				</div>
				<Form.Control asChild>
					<Input placeholder={fieldDef.placeholder} />
				</Form.Control>
				<div className="font-light ml-2 text-xs mt-1">
					<IntegrationMDText description={fieldDef.description} />
				</div>
			</Form.Field>
		)
	} else if (fieldDef.type === "secret") {
		return (
			<Form.Field name={pathKey} key={pathKey} className="mb-2">
				<div className="flex justify-between m-1 ml-2">
					<Form.Label className="font-light text-muted-foreground">{fieldDef.label}</Form.Label>
				</div>
				<Form.Control asChild>
					<Input placeholder={fieldDef.placeholder} type="password" />
				</Form.Control>
				<div className="font-light text-xs mt-1 ml-2">
					<IntegrationMDText description={fieldDef.description} />
				</div>
			</Form.Field>
		)
	} else if (fieldDef.type === "select") {
		return (
			<Form.Field name={pathKey} key={pathKey} className="flex flex-col mb-2 gap-1">
				<div className="flex justify-between ml-2 mr-1">
					<Form.Label className="font-light text-muted-foreground">{fieldDef.label}</Form.Label>
					{/* <FormMessage /> */}
				</div>
				<Select>
					<SelectTrigger className="flex flex-row justify-between p-2 h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground">
						<SelectValue placeholder="Select..." />
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
				<div className="font-light text-xs mt-1 ml-2">
					<IntegrationMDText description={fieldDef.description} />
				</div>
			</Form.Field>
		)
	}

	return <></>
}

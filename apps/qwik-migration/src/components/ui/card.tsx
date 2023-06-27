import { cn } from "@/lib/utils"
import { component$, type QwikIntrinsicElements } from "@builder.io/qwik"

type Div = QwikIntrinsicElements["div"]

const Card = component$<Div>(({ class: className, ...props }) => (
	<div class={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
))

const CardHeader = component$<Div>(({ class: className, ...props }) => (
	<div class={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))

const CardTitle = component$<Div>(({ class: className, ...props }) => (
	<h3 class={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))

const CardDescription = component$<Div>(({ class: className, ...props }) => (
	<p class={cn("text-sm text-muted-foreground", className)} {...props} />
))

const CardContent = component$<Div>(({ class: className, ...props }) => (
	<div class={cn("p-6 pt-0", className)} {...props} />
))

const CardFooter = component$<Div>(({ class: className, ...props }) => (
	<div class={cn(" flex items-center p-6 pt-0", className)} {...props} />
))

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

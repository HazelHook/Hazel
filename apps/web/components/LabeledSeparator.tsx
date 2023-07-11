"use client"

import * as React from "react"

export const LabeledSeparator = ({ label, className, ...props }: { label: string } & React.HTMLProps<HTMLDivElement>) => {
	return (
		<div className={`justify-center items-center flex-row flex gap-2 ml-1 mr-2 ${className}`} {...props}>
			<p className="text-xs font-light text-gray-400">{label}</p>
			<div className="w-full" style={{
                backgroundColor: "hsl(var(--border))",
                height: "1px",
            }}/>
		</div>
	)
}

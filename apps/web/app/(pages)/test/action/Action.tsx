"use client"

import { useState } from "react"

import { useAction } from "@/server/client"
import { Button } from "@/components/ui/button"

import { testAction } from "./_actions"

export function Action() {
	const [text, setText] = useState("")
	const mutation = useAction(testAction, {
		onSuccess(data) {
			data
			// ^?
		},
		onError(error) {
			error
			// ^?
		},
	})

	return (
		<>
			<p>
				<label>
					Text
					<br />
					<input
						type={"text"}
						value={text}
						onChange={(e) => setText(e.target.value)}
						className="bg-slate-300 text-slate-900"
					/>
				</label>
			</p>

			<p>
				<Button
					onClick={() =>
						mutation.mutate({
							text,
						})
					}
				>
					Run server action
				</Button>
			</p>

			<pre
				style={{
					overflowX: "scroll",
				}}
			>
				{JSON.stringify(mutation, null, 4)}
			</pre>
		</>
	)
}

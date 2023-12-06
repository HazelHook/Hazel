import Link from "next/link"

import { Button } from "@hazel/ui/button"
import { Container } from "@hazel/ui/container"
import { Heading } from "@hazel/ui/heading"
import { IconArrowLeft } from "@tabler/icons-react"

export function AdminHeader({ children }: React.PropsWithChildren) {
	return (
		<div className="flex items-center justify-between border-b">
			<Container>
				<div className={"flex w-full justify-between items-center"}>
					<div>
						<Heading type={3}>{children}</Heading>
					</div>

					<Button variant={"ghost"}>
						<Link href={"/"}>
							<span className={"flex space-x-2.5 items-center"}>
								<IconArrowLeft className={"w-4 h-4"} />

								<span>Back to Dashboard</span>
							</span>
						</Link>
					</Button>
				</div>
			</Container>
		</div>
	)
}

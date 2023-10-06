import { ReactElement, ReactNode } from "react"

export const Container = ({ children }: { children: ReactNode | ReactElement }) => {
	return <main className="py-8 container space-y-6">{children}</main>
}

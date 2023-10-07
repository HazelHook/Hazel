export default function Layout(props: {
	children: React.ReactNode
	modals: React.ReactNode
}) {
	return (
		<>
			{props.children}
			{props.modals}
		</>
	)
}

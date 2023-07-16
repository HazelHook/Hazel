export default function Layout(props: {
	children: React.ReactNode
	modals: React.ReactNode
}) {
	return (
		<div>
			{props.children}
			{props.modals}
		</div>
	)
}

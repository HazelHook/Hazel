export default function Layout(props: {
	children: React.ReactNode
	modals: React.ReactNode
}) {
	console.log(props.modals, "XDDDDDD")
	return (
		<div>
			{props.children}
			{props.modals}
		</div>
	)
}

import clsx from "clsx"
import { useEffect, useState } from "react"

interface MeteorsProps {
	className?: string
	number?: number
}
export const Meteors = ({ number = 10, className }: MeteorsProps) => {
	const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([])

	useEffect(() => {
		const styles = [...new Array(number)].map(() => ({
			top: -5,
			left: `${Math.floor(Math.random() * 800 - 400)}px`,
			animationDelay: `${Math.random() * 0.8}${0.2}s`,
			animationDuration: `${Math.floor(Math.random() * 10 + 3)}s`,
		}))
		setMeteorStyles(styles)
	}, [number])

	return (
		<>
			{[...meteorStyles].map((style, idx) => (
				// Meteor Head
				<div
					key={idx}
					className={clsx(
						"absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
						className,
					)}
					style={style}
				>
					{/* Meteor Tail */}
					<div
						style={{
							position: "absolute",
							top: "50%",
							transform: "translateY(-50%)",
							width: "50px",
							height: "1px",
							background: "linear-gradient(90deg, #64748b, transparent)",
							opacity: 1,
						}}
					/>
				</div>
			))}
		</>
	)
}
;<div className="flex gap-2">{}</div>
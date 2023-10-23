import React from "react"

export interface RadialProgressBarProps {
	progress: number
	size?: number
	strokeWidth?: number
}

export const RadialProgressBar: React.FC<RadialProgressBarProps> = ({ progress, size = 100, strokeWidth = 10 }) => {
	const radius = (size - strokeWidth) / 2
	const circumference = radius * 2 * Math.PI
	const strokeDashoffset = circumference - (Math.min(100, progress) / 100) * circumference

	return (
		<svg width={size} height={size} className="text-primary">
			<title>Radial Progress</title>
			<circle
				stroke="currentColor"
				fill="transparent"
				className="text-muted"
				strokeWidth={strokeWidth}
				r={radius}
				cx={size / 2}
				cy={size / 2}
				transform={`rotate(-90, ${size / 2}, ${size / 2})`}
			/>
			<circle
				className="text-primary"
				fill="transparent"
				stroke="currentColor"
				strokeLinecap="round"
				strokeWidth={strokeWidth}
				strokeDasharray={`${circumference} ${circumference}`}
				style={{ strokeDashoffset }}
				r={radius}
				cx={size / 2}
				cy={size / 2}
				transform={`rotate(-90, ${size / 2}, ${size / 2})`}
			/>
			<text className="fill-primary" x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize={size * 0.25}>
				{`${progress}%`}
			</text>
		</svg>
	)
}

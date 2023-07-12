"use client"

import { PropsWithChildren, useEffect, useRef, useState } from "react"

import MousePosition from "./utils/mousePosition"

type HighlightGroupProps = {
	children: React.ReactNode
	className?: string
	dampingFactor?: number
	refresh?: boolean
}

export const HighlightGroup: React.FC<HighlightGroupProps> = ({
	children,
	className = "",
	dampingFactor = 1,
	refresh = false,
}) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const mousePosition = MousePosition()
	const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
	const containerSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 })
	const [boxes, setBoxes] = useState<Array<HTMLElement>>([])

	useEffect(() => {
		containerRef.current && setBoxes(Array.from(containerRef.current.children).map((el) => el as HTMLElement))
	}, [])

	useEffect(() => {
		initContainer()
		window.addEventListener("resize", initContainer)

		return () => {
			window.removeEventListener("resize", initContainer)
		}
	}, [setBoxes])

	useEffect(() => {
		onMouseMove()
	}, [mousePosition])

	useEffect(() => {
		initContainer()
	}, [refresh])

	const initContainer = () => {
		if (containerRef.current) {
			containerSize.current.w = containerRef.current.offsetWidth
			containerSize.current.h = containerRef.current.offsetHeight
		}
	}

	const onMouseMove = () => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect()
			const { w, h } = containerSize.current
			const x = mousePosition.x - rect.left
			const y = mousePosition.y - rect.top
			const inside = x < w && x > 0 && y < h && y > 0
			if (inside) {
				mouse.current.x = x
				mouse.current.y = y
				boxes.forEach((box) => {
					console.log(box)
					// const boxX = (-(box.getBoundingClientRect().left - rect.left) + mouse.current.x) * dampingFactor
					// const boxY = (-(box.getBoundingClientRect().top - rect.top) + mouse.current.y) * dampingFactor
					const boxX = (mouse.current.x / box.getBoundingClientRect().width) * dampingFactor * 100
					const boxY = (mouse.current.y / box.getBoundingClientRect().height) * dampingFactor * 100
					box.style.setProperty("--mouse-x", `${boxX}%`)
					box.style.setProperty("--mouse-y", `${boxY}%`)
				})
			}
		}
	}

	return (
		<div className={className} ref={containerRef}>
			{children}
		</div>
	)
}

type HighlighterItemProps = {
	children: React.ReactNode
	className?: string
}

export const HighlighterItem: React.FC<PropsWithChildren<HighlighterItemProps>> = ({ children, className = "" }) => {
	return (
		<div
			className={`relative bg-zinc-800 rounded-xl p-px before:absolute before:w-96 before:h-96 before:-left-48 before:-top-48 before:bg-mirage before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:hover:opacity-20 before:z-30 before:blur-[100px] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 after:[background:_radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),theme(colors.mirage/80),transparent)] after:group-hover:opacity-100 after:z-10 overflow-hidden ${className}`}
		>
			{children}
		</div>
	)
}

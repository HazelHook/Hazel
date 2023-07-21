import { Particles } from "@/components/react/Particles"
import { MagicCard } from "../react/ui/MagicCard"

interface Props {
	name: string
	description: string
	price: string
	items: string[]
	gradient?: boolean
	tag?: string
	primary?: boolean
	cta: {
		title: string
		href: string
		target?: string
	}
}

export const PricingCard = ({ name, price, description, items, gradient, tag, primary, cta }: Props) => {
	return (
		<MagicCard
			data-aos="fade-down"
			size={500}
			className="group/card flex flex-col px-6 py-8 bg-ebony rounded-3xl lg:order-none cursor-pointer shadow-2xl overflow-hidden"
		>
			<Particles
				vy={-0.2}
				vx={0.04}
				color={primary && "#5F73F7"}
				staticity={100}
				className="absolute inset-0 opacity-10 group-hover/card:opacity-100 transition-opacity duration-700 ease-in-out"
				quantity={100}
			/>
			<div className="relative h-full w-full">
				<div className="gap-12 w-full">
					<div>
						<h3 className={`text-lg ${primary ? "text-accent-400" : "text-white"}`}>
							{name}
							{tag && (
								<span className="font-medium inline-flex items-center bg-ebony border border-white/10 ml-4 px-3 py-0.5 rounded-full text-white text-xs">
									{tag}
								</span>
							)}
						</h3>
						<p className="mt-4 text-2xl font-light text-white">
							{price}
							<span className="text-sm text-zinc-400">/month</span>
						</p>
						<p className="mt-3 text-sm text-white">{description}</p>
					</div>
				</div>
				<div className="inline-flex flex-wrap items-center mt-8 w-full">
					<a
						href={cta.href}
						target={cta.target}
						className="text-sm py-2 w-full px-4 border focus:ring-2 rounded-full border-transparent bg-white hover:bg-white/10 text-black duration-200 focus:ring-offset-2 focus:ring-white hover:text-white inline-flex items-center justify-center ring-1 ring-transparent"
					>
						{cta.title}
					</a>
				</div>

				<ul
					role="list"
					className={`flex flex-col order-last text-sm mt-10 divide-y divide-white/10 ${
						!gradient ? "text-zinc-400" : "text-zinc-50"
					}`}
				>
					{items.map((item) => (
						<li className="inline-flex items-center py-3" key={item}>
							<>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-check"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									strokeWidth="2"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>XD</title>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path d="M5 12l5 5l10 -10" />
								</svg>
								<span className="ml-4">{item}</span>
							</>
						</li>
					))}
				</ul>
			</div>
		</MagicCard>
	)
}

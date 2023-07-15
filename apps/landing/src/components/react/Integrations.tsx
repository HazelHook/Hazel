import { MagicCard, MagicContainer } from "@/components/react/ui/MagicCard"
import { Meteors } from "@/components/react/ui/Meteors"
import { appConfig } from "@/lib/app"
import { Integration } from "@/lib/app.types"
import { AnimatePresence, animate, motion } from "framer-motion"
import { useState } from "react"

function chunk<T>(arr: T[], size: number): T[][] {
	return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))
}

const chunkedIntegrations = chunk(appConfig.landing.integrations, 4)

const swipeConfidenceThreshold = 10000

const swipePower = (offset: number, velocity: number) => {
	return Math.abs(offset) * velocity
}

export const Integrations = () => {
	const [page, setPage] = useState(0)

	const handleNext = () => {
		if (chunkedIntegrations.length <= page + 1) {
			setPage(0)
		} else {
			setPage(page + 1)
		}
	}

	const handlePrevious = () => {
		if (page - 1 < 0) {
			setPage(chunkedIntegrations.length - 1)
		} else {
			setPage(page - 1)
		}
	}
	return (
		<section className="hidden sm:block lg:p-8">
			<div className="mx-auto 2xl:max-w-7xl py-12 lg:px-16 md:px-12 px-8 xl:px-40 items-center w-full">
				<div className="mb-4 lg:mb-0">
					<span className="text-accent-400" data-aos="fade-down">
						Integrations
					</span>
					<h2 data-aos="fade-down" className="text-3xl tracking-tighter mt-6 font-light lg:text-4xl text-white">
						Easily integrates<span className="md:block text-zinc-400">with all your providers</span>
					</h2>
					<p className="mt-4 text-base text-white max-w-md" data-aos="fade-down" data-aos-delay="100">
						Easily validate webhooks automatically by using one of our integrations. If one is still missing just let us
						know and we will add it right away!
					</p>
				</div>
				<div data-aos="fade-down" className="flex flex-col w-full">
					<div className="flex flex-col w-full" aria-labelledby="carousel-label" role="region">
						<h2 className="sr-only" id="carousel-label">
							Carousel
						</h2>
						<span className="sr-only" id="carousel-content-label">
							Carousel
						</span>
						<div className="grid grid-cols-1 lg:grid-cols-4 pb-6 border-b border-white/10">
							<div className="items-center inline-flex lg:col-start-4 lg:ml-auto lg:px-2 mb-4 order-last space-x-2">
								<button
									onClick={handlePrevious}
									type="button"
									className="bg-white/5 hover:bg-white/10 focus:bg-transparent rounded-2xl inline-flex items-center text-center text-white p-4 ring-1 ring-white/10"
								>
									<span aria-hidden="true">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
										>
											<title>WOW</title>
											<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
										</svg>
									</span>
									<span className="sr-only">Skip to previous slide page</span>
								</button>
								<button
									onClick={handleNext}
									type="button"
									className="bg-white/5 hover:bg-white/10 focus:bg-transparent rounded-2xl inline-flex items-center text-center text-white p-4 ring-1 ring-white/10"
								>
									<span aria-hidden="true">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 text-zinc-600 hover:text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth="2"
										>
											<title>WOW</title>
											<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
										</svg>
									</span>
									<span className="sr-only">Skip to next slide page</span>
								</button>
							</div>
						</div>
						<div
							className="flex gap-3 relative overflow-x-scroll pb-24 pt-12 scrollbar-hide snap-mandatory snap-x w-full"
							role="listbox"
							aria-labelledby="carousel-content-label"
						>
							{
								<MagicContainer
									update={page}
									as={motion.div}
									drag="x"
									dragConstraints={{ left: 0, right: 0 }}
									dragElastic={1}
									onDragEnd={(e, { offset, velocity }) => {
										const swipe = swipePower(offset.x, velocity.x)

										if (swipe < -swipeConfidenceThreshold) {
											handleNext()
										} else if (swipe > swipeConfidenceThreshold) {
											handlePrevious()
										}
									}}
									// animate={{ x: `-${page * 100}%` }}
									// transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
									className={
										"group grid grid-flow-col gap-3 group h-full min-h-[150px] md:min-h-[250px] w-full grid-cols-4 md:grid-cols-4"
									}
								>
									{chunkedIntegrations[page].map((integration, index) => (
										<MagicCard
											data-aos="fade-down"
											key={integration.name + index}
											className="cursor-pointer bg-ebony shadow-inset rounded-3xl p-4"
										>
											<div className="relative h-full flex flex-col justify-between">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="icon icon-tabler icon-tabler-circle-check text-white"
													width="16"
													height="16"
													viewBox="0 0 24 24"
													strokeWidth="2"
													stroke="currentColor"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<title>Icon</title>
													<path stroke="none" d="M0 0h24v24H0z" fill="none" />
													<path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
													<path d="M9 12l2 2l4 -4" />
												</svg>
												<div className="md:mt-24">
													<div className="flex flex-row gap-2 items-center mb-1">
														<img
															className="w-8 h-8"
															alt={`${integration.name} Logo`}
															src={integration.logoPath}
															width={32}
															height={32}
														/>
														<p className="font-semibold text-lg leading-6 text-white">{integration.name}</p>
													</div>
													<p className="text-xs mt-2 text-zinc-300 hidden md:block">{integration.description}</p>
												</div>
												<Meteors className="opacity-20 group-hover:opacity-100 transition-opacity duration-700" />
											</div>
										</MagicCard>
									))}
								</MagicContainer>
							}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

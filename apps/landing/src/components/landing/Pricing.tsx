import { PricingCard } from "@/components/landing/PricingCard.tsx"
import { MagicContainer } from "../react/ui/MagicCard"

export const Pricing = () => {
	return (
		<section id="pricing" className="p-4 lg:p-8">
			<div className="mx-auto 2xl:max-w-7xl py-12 lg:px-16 md:px-12 px-8 xl:px-36 items-center relative w-full">
				<div className="text-center max-w-xl mx-auto">
					<span className="text-accent-400" data-aos="fade-down">
						{" "}
						Pricing
					</span>
					<h2 className="text-3xl mt-6 tracking-tighter font-light lg:text-4xl text-white" data-aos="fade-down">
						Pricing build for
						<span className="block text-zinc-400">everyone</span>
					</h2>
				</div>
				<MagicContainer className="grid grid-cols-1 md:grid-cols-2 h-[500px] -mx-4 sm:mx-auto lg:grid-cols-3 xl:mx-0 gap-2 mt-12">
					<PricingCard
						name="Hobby"
						description="Perfect for Hobbist"
						price="free"
						items={["100k Events", "100k Requests", "1 Organization", "3 Members", "All Integrations"]}
						cta={{
							title: "Get Started",
							href: "https://app.hazelhook.dev",
						}}
					/>
					<PricingCard
						name="Pro"
						description="for Startups and indie makers"
						price="$44.99"
						primary
						items={["1m Events", "1m Requests", "3 Organization", "10 Members", "All Integrations"]}
						gradient
						tag="Popular"
						cta={{
							title: "Get Started",
							href: "https://app.hazelhook.dev",
						}}
					/>
					<PricingCard
						name="Enterprise"
						description="for Enterprise Users"
						price="Custom"
						items={[
							"Custom Events",
							"Custom Requests",
							"Unlimited Organizations",
							"Unlimited Members",
							"All Integrations",
						]}
						cta={{
							title: "Contact us",
							href: "https://cal.com/david-hazel/30min",
							target: "__blank",
						}}
					/>
				</MagicContainer>
			</div>
		</section>
	)
}

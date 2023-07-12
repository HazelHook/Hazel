import {
  HighlighterItem,
  HighlightGroup,
} from "@/components/react/Highlighter";
import { Particles } from "@/components/react/Particles";

export const Test = () => {
  return (
    <HighlightGroup className="h-full grid gap-6 md:grid-cols-12 group">
      <div
        className="h-full md:col-span-6 lg:col-span-12 group/item"
        data-aos="fade-down"
      >
        <HighlighterItem>
          <div className="relative h-full bg-ebony rounded-[inherit] z-20 overflow-hidden">
            <Particles
              className="absolute inset-0 -z-10 opacity-10 group-hover/item:opacity-100 transition-opacity duration-700 ease-in-out"
              quantity={200}
            />
            <div className="flex flex-col">
              {/* Radial gradient */}
              <div
                className="absolute bottom-0 w-1/2 pointer-events-none -translate-x-1/2 translate-y-1/2 left-1/2 -z-10 aspect-square"
                aria-hidden="true"
              >
                <div className="absolute inset-0 translate-z-0 bg-zinc-800 rounded-full blur-[80px]" />
              </div>
              {/* Text */}

              <div className="p-8">
                <h3 className="text-lg font-semibold leading-8">Self Hosted</h3>

                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Self host and maintain Highstorm on your own servers
                </p>
                <div className="mt-16 ">
                  <a
                    className="font-medium  whitespace-nowrap transition duration-150 ease-in-out text-zinc-100 hover:text-white group"
                    href="https://github.com/chronark/highstorm"
                  >
                    Deploy your own
                  </a>
                </div>
              </div>
            </div>
          </div>
        </HighlighterItem>
      </div>
    </HighlightGroup>
  );
};

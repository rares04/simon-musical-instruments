import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="mb-12 text-6xl uppercase text-ui-fg-base font-normal"
          >
            Musical Instruments
          </Heading>
          <Text className="text-lg text-ui-fg-subtle font-normal">
            Bowed string instruments makers
          </Text>
          <Text className="text-lg text-ui-fg-subtle font-normal">
            Traditional manufacturing process  *  Quality wood and materials  *   Special final finishing’s
          </Text>
        </span>
        <div className="flex flex-row gap-4 mt-8">
          <LocalizedClientLink
            href="/about-us"
            data-testid="nav-about-us-link"
          >
            <Button className="uppercase text-ui-fg-base w-40 h-12 rounded-3xl bg-transparent hover:bg-ui-bg-base-hover">
              Our Story
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/gallery"
            data-testid="nav-gallery-link"
          >
            <Button className="uppercase text-ui-fg-base w-40 h-12 rounded-3xl bg-transparent hover:bg-ui-bg-base-hover">
              Workshop View
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/store"
            data-testid="nav-store-link"
          >
            <Button className="uppercase text-ui-fg-base w-40 h-12 rounded-3xl bg-transparent hover:bg-ui-bg-base-hover">
              Store
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default Hero

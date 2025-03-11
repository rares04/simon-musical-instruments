import { Heading, Text } from "@medusajs/ui";

export default function AboutUsTemplate() {
  return (
    <div className="flex flex-col gap-y-6 items-center p-4 space-y-12 mt-12">
      <Heading level="h1" className="text-3xl">About Us</Heading>
      <div className="flex flex-row justify-center gap-x-32">
        <img src="/images/about-us-paul.jpg" alt="About Us Paul" />
        <Text className="flex items-center text-lg text-center w-1/3">
          We are Paul and Ecaterina Simon and we are happy to welcome you to our site.
          <br />
          Our main field of activity consists of producing and supplying new bowed string music instruments.
          <br />
          Our little workshop, "our bussiness", started in February 2014 in a small town in Transylvania, Reghin, known as "The City of Violins" due to its tradition in manufacturing bowed string music instruments.
          <br />
          Our first contact with music instruments dates back to 2001, when we started working in a company where the wood for music instruments was prepared. This was the place we learned to carefully select the best wood, which is an important step in manufacturing music instruments of the highest quality.
        </Text>
      </div>
      <div className="flex flex-row justify-center gap-x-32">
        <Text className="flex items-center text-lg text-center w-1/3">
          Together with our colleagues who have a vast experience, we manually prepare wood by traditional procedures, through dozens of stages for each instrument, aiming to obtain the nicest sound from each piece of wood.
          <br />
          In our warehouse the wood is kept and dried only naturally.
          <br />
          In our workshop we pay special atention to the lacquering and finishing process of the instruments. We lacquer each instrument only by hand, with ones of the best lacquers, based on natural resins.
          <br />
          Our portfolio contains the whole range of string instruments: violins, violas, cellos and contrabasses.
          <br />
          The quality of our products is appreciated by our clients and collaborators from countries like France, Belgium, Spain, Germany, Japan, Taiwan, etc.
          <br />
          <br />
          We invite you to our virtual workshop...
        </Text>
        <img src="/images/about-us-ecaterina.jpg" alt="About Us Ecaterina" />
      </div>
    </div>
  )
}
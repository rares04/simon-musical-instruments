import { Envelope, Phone, MapPin } from "@medusajs/icons";
import { Heading, Text } from "@medusajs/ui";
import ContactForm from "../components/contact-form";

export default function ContactTemplate() {
  return (
    <div className="flex flex-row gap-10 justify-center mt-6">
      <ContactForm />
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row gap-x-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center"> 
              <MapPin className="mr-1"/> 
              <Heading level="h2" className="py-1">Address:</Heading>
            </div>
            <Text className="text-ui-fg-muted">1 Decembrie 1918 street, no. 8</Text>
            <Text className="text-ui-fg-muted">545300 Reghin, ROMANIA</Text>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center"> 
              <Envelope className="mr-1"/> 
              <Heading level="h2" className="py-1">Email:</Heading>
            </div>
            <Text className="text-ui-fg-muted">paul.simon@simoninstruments.com</Text>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center"> 
              <Phone className="mr-1"/> 
              <Heading level="h2" className="py-1">Phone:</Heading>
            </div>
            <Text className="text-ui-fg-muted">+40 744 960 722</Text>
            <Text className="text-ui-fg-muted">+40 365 100 422 (FAX)</Text>
          </div>
        </div>
        <div className="flex justify-center p-2">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2731.7836900764237!2d24.711977476663733!3d46.78886654408704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474a37a96979b5f7%3A0x62dde59b74d861!2sPaul%20Simon%20-%20Musical%20Instruments!5e0!3m2!1sro!2sro!4v1737897761882!5m2!1sro!2sro" 
            style={{border: 0}}
            allowFullScreen={true}
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[350px]"
          >
          </iframe>
        </div>
      </div>
    </div>
  )
}
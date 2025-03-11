"use client"

import { Input } from "@lib/components/ui/input";
import { Separator } from "@lib/components/ui/separator";
import { Textarea } from "@lib/components/ui/textarea";
import { Button, Heading } from "@medusajs/ui";
import { useCallback, useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Sending message...")
    console.log(name, email, message)
  }, [name, email, message])

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col">
        <Heading level="h1" className="text-3xl mb-4">We look forward to your message</Heading>
        <Separator className="bg-black w-16 h-[2px]"/>
      </div>
      <form onSubmit={handleSend} className="flex flex-col gap-y-4">
        <Input 
          type="text" 
          placeholder="Name*" 
          className="h-12"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input 
          type="email" 
          placeholder="Email*" 
          className="h-12" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Textarea 
          placeholder="Message" 
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button 
          className="uppercase bg-black text-white w-28 h-12 rounded-3xl" 
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  )
}
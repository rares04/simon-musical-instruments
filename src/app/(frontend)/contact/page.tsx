'use client'

import type React from 'react'
import { useState } from 'react'
import { MapPin, Mail, Phone, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        }, 5000)
      } else {
        alert('Failed to send message. Please try again or email us directly.')
      }
    } catch {
      alert('Failed to send message. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              We Look Forward to Your Message
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Whether you&apos;re interested in our instruments, have questions about our craft, or
              simply want to say hello—we&apos;d love to hear from you.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto mb-16">
            {/* Contact Form */}
            <div className="bg-card rounded-lg p-6 lg:p-8 shadow-sm border border-border/60">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
                    Thank You!
                  </h3>
                  <p className="text-muted-foreground">
                    We typically respond within 1-2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1.5 border-border/60 focus:ring-accent cursor-text"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1.5 border-border/60 focus:ring-accent cursor-text"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-foreground">
                      Phone <span className="text-muted-foreground text-sm">(optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1.5 border-border/60 focus:ring-accent cursor-text"
                      placeholder="+40 123 456 789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-foreground">
                      Subject <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      required
                      value={formData.subject}
                      onValueChange={(value: string) => setFormData((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger className="mt-1.5 border-border/60 focus:ring-accent cursor-pointer">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general" className="cursor-pointer">
                          General Inquiry
                        </SelectItem>
                        <SelectItem value="purchase" className="cursor-pointer">
                          Instrument Purchase
                        </SelectItem>
                        <SelectItem value="custom" className="cursor-pointer">
                          Custom Order
                        </SelectItem>
                        <SelectItem value="other" className="cursor-pointer">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-foreground">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1.5 border-border/60 focus:ring-accent resize-none cursor-text"
                      placeholder="Tell us about your interest in our instruments..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-6">
              {/* Address */}
              <div className="bg-muted/30 rounded-lg p-6 border border-border/40">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Workshop Address</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Strada 1 Decembrie 1918, nr. 8<br />
                      Reghin, 545300
                      <br />
                      ROMANIA
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-muted/30 rounded-lg p-6 border border-border/40">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Email</h3>
                    <a
                      href="mailto:paul.simon@simoninstruments.com"
                      className="text-accent hover:underline cursor-pointer"
                    >
                      paul.simon@simoninstruments.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-muted/30 rounded-lg p-6 border border-border/40">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Phone & Fax</h3>
                    <p className="text-muted-foreground">
                      Phone:{' '}
                      <a href="tel:+40744960722" className="text-accent hover:underline cursor-pointer">
                        +40 744 960 722
                      </a>
                      <br />
                      Fax: +40 365 100 422
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-muted/30 rounded-lg p-6 border border-border/40">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Workshop Hours</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Monday - Friday: 9:00 AM - 5:00 PM
                      <br />
                      Saturday: By appointment
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-6 text-center">
              Visit Our Workshop
            </h2>
            <div className="rounded-lg overflow-hidden shadow-md border border-border/60">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2731.5!2d24.7089!3d46.7769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474bb3e1e1e1e1e1%3A0x1e1e1e1e1e1e1e1!2sStrada%201%20Decembrie%201918%2C%20Reghin%2C%20Romania!5e0!3m2!1sen!2sro!4v1234567890"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Simon Instruments Workshop Location"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


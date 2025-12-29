import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-serif text-xl text-foreground">Simon Musical Instruments</h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md text-pretty">
              Handcrafted bowed string instruments from the heart of Transylvania, where tradition meets exceptional
              craftsmanship.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-foreground">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Strada 1 Decembrie 1918, nr. 8<br />
                  Reghin, 545300
                  <br />
                  Romania
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:paul.simon@simoninstruments.com">paul.simon@simoninstruments.com</a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+40744960722">+40 744 960 722</a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-foreground">Explore</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="/gallery"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Shop Instruments
              </Link>
              <Link
                href="#story"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Our Story
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Simon Musical Instruments. All rights reserved.</p>
            <p className="text-xs">Crafted with care in Reghin, Romania</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useCart } from '@/lib/cart-context'
import { X, ShoppingBag, Package, Shield, Truck } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function CartDrawer() {
  const { items, removeItem, isOpen, closeCart, itemCount } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-background border-l border-border z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-accent" />
              <h2 className="font-serif text-xl font-bold text-foreground">Your Selection</h2>
              {itemCount > 0 && (
                <span className="bg-accent text-accent-foreground px-2 py-0.5 text-xs font-medium rounded-full">
                  {itemCount}
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <div className="relative w-32 h-32 mb-6 opacity-30">
                  <svg
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    {/* Empty violin case illustration */}
                    <rect
                      x="50"
                      y="40"
                      width="100"
                      height="120"
                      rx="8"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path d="M50 80 L150 80" stroke="currentColor" strokeWidth="2" />
                    <circle cx="100" cy="110" r="3" fill="currentColor" />
                    <path
                      d="M70 50 Q100 65 130 50"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                  Your cart is empty
                </h3>
                <p className="text-sm text-muted-foreground text-balance">
                  Explore our collection of handcrafted instruments
                </p>
                <Button
                  onClick={closeCart}
                  variant="outline"
                  className="mt-6 bg-transparent cursor-pointer"
                >
                  Continue Browsing
                </Button>
              </div>
            ) : (
              /* Cart Items */
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-border last:border-b-0"
                  >
                    {/* Instrument Image */}
                    <div className="relative w-24 h-32 bg-muted overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-serif font-semibold text-base text-foreground text-balance leading-tight mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.type}</p>
                        <p className="font-serif text-lg font-bold text-accent">
                          €{item.price.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors self-start mt-2 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Only show when there are items */}
          {items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4 bg-muted/30">
              {/* Trust Indicators */}
              <div className="space-y-2 pb-4 border-b border-border">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Fully insured delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Secure shipping via FedEx</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Package className="h-4 w-4 text-accent flex-shrink-0" />
                  <span>Professional packaging</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-baseline justify-between pb-4">
                <span className="text-base font-medium text-foreground">Total</span>
                <span className="font-serif text-2xl font-bold text-accent">
                  €{items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                </span>
              </div>

              <Button
                asChild
                size="lg"
                className="w-full h-12 text-base font-medium cursor-pointer"
                onClick={closeCart}
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center text-balance">
                Need assistance? Contact us for a personal consultation
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

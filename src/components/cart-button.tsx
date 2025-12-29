"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartButton() {
  const { itemCount, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-muted rounded-lg transition-colors"
      aria-label="Open shopping cart"
    >
      <ShoppingBag className="h-5 w-5 text-foreground" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  )
}

'use client'

import type React from 'react'

import { createContext, useContext, useState, useCallback } from 'react'

export interface CartItem {
  id: string
  name: string
  type: string
  price: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      // Check if item already exists (since these are unique instruments)
      const exists = prev.find((i) => i.id === item.id)
      if (exists) {
        return prev // Don't add duplicates
      }
      return [...prev, item]
    })
    setIsOpen(true) // Auto-open cart when item is added
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const itemCount = items.length

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, isOpen, openCart, closeCart, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

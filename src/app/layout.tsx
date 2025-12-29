import type React from 'react'

// Passthrough layout - each route group has its own html/body
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}

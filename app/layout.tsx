import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LE Website Drive',
  description: 'All-in-one personal storage, links, MCP connections, authenticator & cloud sync',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">{children}</body>
    </html>
  )
}
'use client'

import Link from 'next/link'
import { HardDrive, Share2, Shield, User, Cloud, ExternalLink } from 'lucide-react'

export default function DashboardHome() {
  const cards = [
    { href: '/web/dashboard/drive', title: 'Drive', desc: 'Encrypted storage', icon: HardDrive, color: 'text-sky-400' },
    { href: '/web/dashboard/connection', title: 'Connections', desc: 'MCP links & apps', icon: Share2, color: 'text-violet-400' },
    { href: '/web/dashboard/auth', title: 'Authenticator', desc: 'Secure codes', icon: Shield, color: 'text-green-400' },
    { href: '/web/dashboard/account', title: 'Account', desc: 'Profile & settings', icon: User, color: 'text-amber-400' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-zinc-500 text-sm mt-1">Welcome to LE Website Drive • Official</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 transition group"
          >
            <card.icon className={`w-8 h-8 mb-3 ${card.color}`} />
            <h3 className="font-medium group-hover:text-sky-400 transition">{card.title}</h3>
            <p className="text-zinc-500 text-sm mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink className="w-4 h-4 text-sky-400" />
          <h3 className="font-medium text-sm">MCP Server</h3>
        </div>
        <p className="text-zinc-500 text-xs mb-3">Other AIs can connect using this endpoint:</p>
        <code className="block bg-black rounded-lg p-3 text-sky-300 text-xs break-all">
          https://le-website-drive-web-developer-560b.vercel.app/web/api/MCP
        </code>
      </div>
    </div>
  )
}
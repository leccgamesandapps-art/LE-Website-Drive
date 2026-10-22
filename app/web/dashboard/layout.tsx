'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { HardDrive, Link2, Share2, Shield, User, LogOut, Menu, Github, Cloud } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('le_official_user')
    if (!saved) {
      router.push('/web')
      return
    }
    setUser(JSON.parse(saved))
  }, [router])

  const logout = () => {
    localStorage.removeItem('le_official_user')
    router.push('/web')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-sky-400">Loading...</div>
      </div>
    )
  }

  const nav = [
    { href: '/web/dashboard', label: 'Overview', icon: HardDrive },
    { href: '/web/dashboard/drive', label: 'Drive', icon: HardDrive },
    { href: '/web/dashboard/connection', label: 'Connections', icon: Share2 },
    { href: '/web/dashboard/auth', label: 'Authenticator', icon: Shield },
    { href: '/web/dashboard/account', label: 'Account', icon: User },
  ]

  return (
    <div className="min-h-screen flex bg-black text-white">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static`}>
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-600 rounded-xl flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">LE Drive</p>
              <p className="text-xs text-zinc-500">{user.display_name}</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition ${
                pathname === item.href
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-600/30'
                  : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 space-y-2">
          <a href="https://github.com/leccgamesandapps-art" target="_blank"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white">
            <Github className="w-4 h-4" /> GitHub Profile
          </a>
          <button onClick={logout} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 w-full">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
          <button className="md:hidden p-1.5" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-sm capitalize">
            {pathname.split('/').pop() || 'Dashboard'}
          </h1>
        </header>

        <div className="p-4 md:p-6 max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
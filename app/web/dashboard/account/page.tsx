'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Github, LogOut, User } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('le_official_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const logout = () => {
    localStorage.removeItem('le_official_user')
    router.push('/web')
  }

  if (!user) return null

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Account</h2>
        <p className="text-zinc-500 text-sm">Profile & settings</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-sky-600 rounded-2xl flex items-center justify-center">
            <User className="w-7 h-7" />
          </div>
          <div>
            <p className="font-medium text-lg">{user.display_name}</p>
            <p className="text-zinc-500 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-zinc-800">
            <span className="text-zinc-500">User ID</span>
            <span className="font-mono text-xs">{user.user_id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-800">
            <span className="text-zinc-500">Database</span>
            <span className="text-sky-400">INFI DATABASE</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="https://github.com/leccgamesandapps-art" target="_blank"
            className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-2.5 rounded-xl text-sm hover:bg-zinc-800">
            <Github className="w-4 h-4" /> GitHub Profile
          </a>
          <button onClick={logout}
            className="flex items-center justify-center gap-2 bg-red-600/10 border border-red-600/30 text-red-400 px-4 py-2.5 rounded-xl text-sm hover:bg-red-600/20">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
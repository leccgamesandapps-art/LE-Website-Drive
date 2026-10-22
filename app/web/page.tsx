'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { HardDrive, Github, UserPlus, LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')

    const user_id = email.toLowerCase().trim()
    const display_name = user_id.split('@')[0]

    try {
      const { error: dbError } = await supabase
        .from('users')
        .upsert({ user_id, email: user_id, display_name }, { onConflict: 'user_id' })

      if (dbError) {
        setError(dbError.message)
        setLoading(false)
        return
      }

      localStorage.setItem('le_official_user', JSON.stringify({ user_id, email: user_id, display_name }))
      router.push('/web/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HardDrive className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold">LE Website Drive</h1>
          <p className="text-zinc-500 text-sm mt-1">Official • INFI DATABASE</p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          <div className="flex mb-6 bg-zinc-900 rounded-xl p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                mode === 'login' ? 'bg-sky-600 text-white' : 'text-zinc-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                mode === 'register' ? 'bg-sky-600 text-white' : 'text-zinc-400'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl flex items-center justify-center gap-2"
            >
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-zinc-800">
            <a
              href="https://github.com/leccgamesandapps-art"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-sm py-2.5 rounded-xl"
            >
              <Github className="w-4 h-4" />
              GitHub Profile
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          <a href="/web/doc" className="hover:text-sky-400">Documentation</a>
        </p>
      </div>
    </div>
  )
}
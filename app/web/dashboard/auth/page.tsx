'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Copy, Check } from 'lucide-react'

export default function AuthPage() {
  const [user, setUser] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', secret: '', issuer: '' })
  const [copied, setCopied] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('le_official_user')
    if (saved) {
      const u = JSON.parse(saved)
      setUser(u)
      load(u.user_id)
    }
  }, [])

  const load = async (user_id: string) => {
    const { data } = await supabase.from('authenticators').select('*').eq('user_id', user_id).order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  const add = async () => {
    if (!user || !form.name || !form.secret) return
    const { data, error } = await supabase.from('authenticators').insert({
      user_id: user.user_id,
      name: form.name,
      secret: form.secret,
      issuer: form.issuer
    }).select().single()

    if (error) setMsg(error.message)
    else {
      setItems([data, ...items])
      setForm({ name: '', secret: '', issuer: '' })
      setMsg('Saved • secret locked')
    }
    setTimeout(() => setMsg(''), 2500)
  }

  const remove = async (id: string) => {
    await supabase.from('authenticators').delete().eq('id', id)
    setItems(items.filter(i => i.id !== id))
  }

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Authenticator</h2>
          <p className="text-zinc-500 text-sm">Name editable • Secret permanently locked after save</p>
        </div>
        {msg && <span className="text-xs text-sky-400">{msg}</span>}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <input placeholder="Name (Google, Discord...)" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
        <input placeholder="Secret / Code" value={form.secret} onChange={e => setForm({...form, secret: e.target.value})}
          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
        <input placeholder="Issuer (optional)" value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})}
          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
        <button onClick={add} className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Save Authenticator
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(item => (
          <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                {item.issuer && <p className="text-xs text-zinc-500">{item.issuer}</p>}
              </div>
              <button onClick={() => remove(item.id)} className="text-zinc-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="bg-black rounded-lg p-2.5 flex justify-between items-center">
              <code className="text-green-400 text-sm tracking-widest">••••••••</code>
              <button onClick={() => copy(item.secret, item.id)}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded flex items-center gap-1">
                {copied === item.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Copy
              </button>
            </div>
            <p className="text-[10px] text-zinc-600 mt-1.5">Secret locked</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-zinc-600 py-10 text-sm col-span-2">No authenticators yet</p>}
      </div>
    </div>
  )
}
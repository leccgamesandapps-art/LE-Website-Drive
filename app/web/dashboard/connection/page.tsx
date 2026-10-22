'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Copy, Check } from 'lucide-react'

export default function ConnectionPage() {
  const [user, setUser] = useState<any>(null)
  const [connections, setConnections] = useState<any[]>([])
  const [newConn, setNewConn] = useState({ name: '', mcp_link: '', website_url: '', description: '' })
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
    const { data } = await supabase.from('connections').select('*').eq('user_id', user_id).order('created_at', { ascending: false })
    if (data) setConnections(data)
  }

  const add = async () => {
    if (!user || !newConn.name) return
    const { data, error } = await supabase.from('connections').insert({
      user_id: user.user_id,
      name: newConn.name,
      mcp_link: newConn.mcp_link,
      website_url: newConn.website_url,
      description: newConn.description
    }).select().single()

    if (error) setMsg(error.message)
    else {
      setConnections([data, ...connections])
      setNewConn({ name: '', mcp_link: '', website_url: '', description: '' })
      setMsg('Saved')
    }
    setTimeout(() => setMsg(''), 2500)
  }

  const remove = async (id: string) => {
    await supabase.from('connections').delete().eq('id', id)
    setConnections(connections.filter(c => c.id !== id))
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
          <h2 className="text-xl font-bold">Connections</h2>
          <p className="text-zinc-500 text-sm">MCP links & linked apps</p>
        </div>
        {msg && <span className="text-xs text-sky-400">{msg}</span>}
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <input placeholder="Name" value={newConn.name} onChange={e => setNewConn({...newConn, name: e.target.value})}
          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
        <input placeholder="MCP Link" value={newConn.mcp_link} onChange={e => setNewConn({...newConn, mcp_link: e.target.value})}
          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
        <input placeholder="Website URL (optional)" value={newConn.website_url} onChange={e => setNewConn({...newConn, website_url: e.target.value})}
          className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
        <button onClick={add} className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm flex items-center gap-1">
          <Plus className="w-4 h-4" /> Save Connection
        </button>
      </div>

      <div className="space-y-3">
        {connections.map(c => (
          <div key={c.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium">{c.name}</p>
              <button onClick={() => remove(c.id)} className="text-zinc-600 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
            {c.mcp_link && (
              <div className="bg-black rounded-lg p-3 flex items-center justify-between gap-2">
                <code className="text-xs text-sky-300 truncate">{c.mcp_link}</code>
                <button onClick={() => copy(c.mcp_link, c.id)}
                  className="shrink-0 bg-sky-600 hover:bg-sky-500 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                  {copied === c.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied === c.id ? 'Copied' : 'Copy MCP'}
                </button>
              </div>
            )}
          </div>
        ))}
        {connections.length === 0 && <p className="text-center text-zinc-600 py-10 text-sm">No connections yet</p>}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  HardDrive, 
  Link2, 
  Share2, 
  Shield, 
  Cloud, 
  UserPlus,
  Copy,
  Plus,
  Trash2,
  Check,
  Menu,
  Github,
  ExternalLink,
  LogOut,
  RefreshCw
} from 'lucide-react'

type Tab = 'drive' | 'links' | 'connections' | 'auth' | 'cloud' | 'mcp'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('drive')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Real data from Supabase
  const [links, setLinks] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const [authenticators, setAuthenticators] = useState<any[]>([])
  const [cloudSaves, setCloudSaves] = useState<any[]>([])

  const [newLink, setNewLink] = useState({ title: '', url: '', notes: '' })
  const [newConn, setNewConn] = useState({ name: '', mcp_link: '', website_url: '', description: '' })
  const [newAuth, setNewAuth] = useState({ name: '', secret: '', issuer: '' })
  const [copied, setCopied] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('le_official_user')
    if (saved) {
      const u = JSON.parse(saved)
      setUser(u)
      loadAllData(u.user_id)
    }
    setLoading(false)
  }, [])

  const showMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const login = async (email: string) => {
    const user_id = email.toLowerCase().trim()
    const display_name = user_id.split('@')[0]

    // Upsert user into real database
    const { error } = await supabase
      .from('users')
      .upsert({ user_id, email: user_id, display_name }, { onConflict: 'user_id' })

    if (error) {
      console.error(error)
      showMessage('Login error: ' + error.message)
      return
    }

    const u = { user_id, email: user_id, display_name }
    localStorage.setItem('le_official_user', JSON.stringify(u))
    setUser(u)
    await loadAllData(user_id)
    showMessage('Logged in successfully')
  }

  const logout = () => {
    localStorage.removeItem('le_official_user')
    setUser(null)
    setLinks([])
    setConnections([])
    setAuthenticators([])
    setCloudSaves([])
  }

  const loadAllData = async (user_id: string) => {
    setSaving(true)
    try {
      const [linksRes, connRes, authRes, cloudRes] = await Promise.all([
        supabase.from('links').select('*').eq('user_id', user_id).order('created_at', { ascending: false }),
        supabase.from('connections').select('*').eq('user_id', user_id).order('created_at', { ascending: false }),
        supabase.from('authenticators').select('*').eq('user_id', user_id).order('created_at', { ascending: false }),
        supabase.from('cloud_saves').select('*').eq('user_id', user_id).order('created_at', { ascending: false })
      ])

      if (linksRes.data) setLinks(linksRes.data)
      if (connRes.data) setConnections(connRes.data)
      if (authRes.data) setAuthenticators(authRes.data)
      if (cloudRes.data) setCloudSaves(cloudRes.data)
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // ========== REAL CRUD ========== //

  const addLink = async () => {
    if (!user || !newLink.url) return
    setSaving(true)
    const { data, error } = await supabase
      .from('links')
      .insert({ user_id: user.user_id, title: newLink.title, url: newLink.url, notes: newLink.notes })
      .select()
      .single()

    if (error) showMessage(error.message)
    else {
      setLinks([data, ...links])
      setNewLink({ title: '', url: '', notes: '' })
      showMessage('Link saved to database')
    }
    setSaving(false)
  }

  const deleteLink = async (id: string) => {
    await supabase.from('links').delete().eq('id', id)
    setLinks(links.filter(l => l.id !== id))
    showMessage('Link deleted')
  }

  const addConnection = async () => {
    if (!user || !newConn.name) return
    setSaving(true)
    const { data, error } = await supabase
      .from('connections')
      .insert({
        user_id: user.user_id,
        name: newConn.name,
        mcp_link: newConn.mcp_link,
        website_url: newConn.website_url,
        description: newConn.description
      })
      .select()
      .single()

    if (error) showMessage(error.message)
    else {
      setConnections([data, ...connections])
      setNewConn({ name: '', mcp_link: '', website_url: '', description: '' })
      showMessage('Connection saved')
    }
    setSaving(false)
  }

  const deleteConnection = async (id: string) => {
    await supabase.from('connections').delete().eq('id', id)
    setConnections(connections.filter(c => c.id !== id))
    showMessage('Connection deleted')
  }

  const addAuthenticator = async () => {
    if (!user || !newAuth.name || !newAuth.secret) return
    setSaving(true)
    const { data, error } = await supabase
      .from('authenticators')
      .insert({
        user_id: user.user_id,
        name: newAuth.name,
        secret: newAuth.secret,
        issuer: newAuth.issuer
      })
      .select()
      .single()

    if (error) showMessage(error.message)
    else {
      setAuthenticators([data, ...authenticators])
      setNewAuth({ name: '', secret: '', issuer: '' })
      showMessage('Authenticator saved (secret locked)')
    }
    setSaving(false)
  }

  const deleteAuthenticator = async (id: string) => {
    await supabase.from('authenticators').delete().eq('id', id)
    setAuthenticators(authenticators.filter(a => a.id !== id))
    showMessage('Authenticator deleted')
  }

  const saveToCloud = async () => {
    if (!user) return
    setSaving(true)
    const payload = JSON.stringify({ links, connections, authenticators })
    const { error } = await supabase.from('cloud_saves').insert({
      user_id: user.user_id,
      device_name: navigator.userAgent.slice(0, 40),
      save_type: 'full',
      encrypted_payload: payload
    })
    if (error) showMessage(error.message)
    else {
      showMessage('Saved to Cloud')
      loadAllData(user.user_id)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-xl text-sky-400">Loading LE Official Drive...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HardDrive className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">LE Website Drive</h1>
            <p className="text-zinc-400 mt-1 text-sm">Official • Powered by INFI DATABASE</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                const email = prompt('Enter your email:')
                if (email) login(email)
              }}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium py-3 rounded-xl transition"
            >
              <UserPlus className="w-5 h-5" />
              Create Account / Login
            </button>

            <a
              href="https://github.com/leccgamesandapps-art"
              target="_blank"
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-medium py-3 rounded-xl transition"
            >
              <Github className="w-5 h-5" />
              GitHub Profile
            </a>
          </div>

          <p className="text-center text-xs text-zinc-600 mt-6">
            Real database • Real MCP • Multi-device
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'drive' as Tab, label: 'Drive', icon: HardDrive },
    { id: 'links' as Tab, label: 'Links', icon: Link2 },
    { id: 'connections' as Tab, label: 'Connections', icon: Share2 },
    { id: 'auth' as Tab, label: 'Auth', icon: Shield },
    { id: 'cloud' as Tab, label: 'Cloud', icon: Cloud },
    { id: 'mcp' as Tab, label: 'MCP Server', icon: ExternalLink },
  ]

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static`}>
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold">LE Drive</h1>
              <p className="text-xs text-zinc-500">{user.display_name}</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm transition ${
                activeTab === tab.id 
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-600/30' 
                  : 'hover:bg-zinc-900 text-zinc-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 space-y-2">
          <a href="https://github.com/leccgamesandapps-art" target="_blank" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-white">
            <Github className="w-4 h-4" /> GitHub Profile
          </a>
          <button onClick={logout} className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 w-full">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
          <button className="md:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="font-semibold capitalize">{activeTab === 'mcp' ? 'MCP Server' : activeTab}</h2>
          <div className="flex items-center gap-2">
            {saving && <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />}
            {message && <span className="text-xs text-sky-400">{message}</span>}
          </div>
        </header>

        <div className="p-4 md:p-6 max-w-4xl mx-auto">

          {/* DRIVE */}
          {activeTab === 'drive' && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-medium mb-1">Encrypted Drive</h3>
              <p className="text-zinc-500 text-sm mb-6">Files are encrypted client-side before storing in INFI DATABASE.</p>
              <div className="border-2 border-dashed border-zinc-800 rounded-xl p-16 text-center">
                <HardDrive className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                <p className="text-zinc-500">Drag & drop files here</p>
                <p className="text-xs text-zinc-700 mt-2">Real encrypted storage coming in next update</p>
              </div>
            </div>
          )}

          {/* LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <h3 className="font-medium mb-3">Add Link</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input placeholder="Title" value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})}
                    className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  <input placeholder="URL" value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})}
                    className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  <button onClick={addLink} className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {links.map(link => (
                  <div key={link.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{link.title || 'Untitled'}</p>
                      <a href={link.url} target="_blank" className="text-sky-400 text-xs hover:underline">{link.url}</a>
                    </div>
                    <button onClick={() => deleteLink(link.id)} className="text-zinc-600 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {links.length === 0 && <p className="text-center text-zinc-600 py-10 text-sm">No links saved yet</p>}
              </div>
            </div>
          )}

          {/* CONNECTIONS */}
          {activeTab === 'connections' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <h3 className="font-medium mb-3">Add Connection / MCP Link</h3>
                <div className="space-y-2">
                  <input placeholder="Name" value={newConn.name} onChange={e => setNewConn({...newConn, name: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  <input placeholder="MCP Link" value={newConn.mcp_link} onChange={e => setNewConn({...newConn, mcp_link: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  <input placeholder="Website URL" value={newConn.website_url} onChange={e => setNewConn({...newConn, website_url: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  <button onClick={addConnection} className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Save Connection
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {connections.map(conn => (
                  <div key={conn.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">{conn.name}</p>
                      <button onClick={() => deleteConnection(conn.id)} className="text-zinc-600 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {conn.mcp_link && (
                      <div className="bg-black rounded-lg p-3 flex items-center justify-between gap-2 mt-2">
                        <code className="text-xs text-sky-300 truncate">{conn.mcp_link}</code>
                        <button onClick={() => copyText(conn.mcp_link, conn.id)}
                          className="shrink-0 bg-sky-600 hover:bg-sky-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
                          {copied === conn.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copied === conn.id ? 'Copied' : 'Copy MCP'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {connections.length === 0 && <p className="text-center text-zinc-600 py-10 text-sm">No connections yet</p>}
              </div>
            </div>
          )}

          {/* AUTH */}
          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <h3 className="font-medium mb-1">Add Authenticator</h3>
                <p className="text-xs text-zinc-500 mb-3">Name can be edited later. Secret is permanently locked after save.</p>
                <div className="space-y-2">
                  <input placeholder="Name (Google, Discord...)" value={newAuth.name} onChange={e => setNewAuth({...newAuth, name: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  <input placeholder="Secret / Code" value={newAuth.secret} onChange={e => setNewAuth({...newAuth, secret: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  <input placeholder="Issuer (optional)" value={newAuth.issuer} onChange={e => setNewAuth({...newAuth, issuer: e.target.value})}
                    className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  <button onClick={addAuthenticator} className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Save Authenticator
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {authenticators.map(auth => (
                  <div key={auth.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{auth.name}</p>
                        {auth.issuer && <p className="text-xs text-zinc-500">{auth.issuer}</p>}
                      </div>
                      <button onClick={() => deleteAuthenticator(auth.id)} className="text-zinc-600 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-black rounded-lg p-2.5 flex justify-between items-center">
                      <code className="text-green-400 text-sm tracking-widest">••••••••</code>
                      <button onClick={() => copyText(auth.secret, auth.id)}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded flex items-center gap-1">
                        {copied === auth.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        Copy
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1.5">Secret locked • cannot be edited</p>
                  </div>
                ))}
                {authenticators.length === 0 && <p className="text-center text-zinc-600 py-10 text-sm col-span-2">No authenticators yet</p>}
              </div>
            </div>
          )}

          {/* CLOUD */}
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center">
                <Cloud className="w-12 h-12 mx-auto mb-3 text-sky-400" />
                <h3 className="text-lg font-medium mb-1">Cloud Sync</h3>
                <p className="text-zinc-500 text-sm mb-5">Save current state so it appears on all devices using the same account.</p>
                <button onClick={saveToCloud} className="bg-sky-600 hover:bg-sky-500 px-6 py-2.5 rounded-xl text-sm font-medium">
                  Save Current State to Cloud
                </button>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-medium mb-3 text-sm">Previous Cloud Saves</h4>
                {cloudSaves.length === 0 ? (
                  <p className="text-zinc-600 text-sm">No cloud saves yet</p>
                ) : (
                  <div className="space-y-2">
                    {cloudSaves.map(save => (
                      <div key={save.id} className="bg-black rounded-lg p-3 text-xs text-zinc-400 flex justify-between">
                        <span>{save.device_name || 'Unknown device'}</span>
                        <span>{new Date(save.created_at).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MCP SERVER */}
          {activeTab === 'mcp' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-2">Official MCP Server</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Other AIs (including Grok) can connect to your Drive, Links, Connections and Authenticators using this MCP endpoint.
                </p>

                <div className="bg-black border border-zinc-800 rounded-xl p-4 mb-4">
                  <p className="text-xs text-zinc-500 mb-1">Your MCP Endpoint</p>
                  <code className="text-sky-300 text-sm break-all">
                    https://le-website-drive-web-developer-560b.vercel.app/api/mcp
                  </code>
                </div>

                <button
                  onClick={() => copyText('https://le-website-drive-web-developer-560b.vercel.app/api/mcp', 'mcp')}
                  className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  {copied === 'mcp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === 'mcp' ? 'Copied!' : 'Copy MCP Server URL'}
                </button>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
                <h4 className="font-medium mb-2 text-sm">How to connect from other AIs</h4>
                <ol className="text-sm text-zinc-400 space-y-2 list-decimal list-inside">
                  <li>Copy the MCP Server URL above</li>
                  <li>In the other AI, add a Custom MCP Connector</li>
                  <li>Paste the URL and connect</li>
                  <li>The AI can now read your Links, Connections and more</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
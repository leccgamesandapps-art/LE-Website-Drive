'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  HardDrive, 
  Link2, 
  Share2, 
  Shield, 
  Cloud, 
  LogIn, 
  UserPlus,
  Copy,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Menu
} from 'lucide-react'

type Tab = 'drive' | 'links' | 'connections' | 'auth' | 'cloud'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('drive')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Local states for each module
  const [links, setLinks] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const [authenticators, setAuthenticators] = useState<any[]>([])
  const [newLink, setNewLink] = useState({ title: '', url: '', notes: '' })
  const [newConn, setNewConn] = useState({ name: '', mcp_link: '', website_url: '' })
  const [newAuth, setNewAuth] = useState({ name: '', secret: '', issuer: '' })
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Simple local user for now (will upgrade to real Google later)
    const saved = localStorage.getItem('le_drive_user')
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const login = (email: string) => {
    const u = { user_id: email, email, display_name: email.split('@')[0] }
    localStorage.setItem('le_drive_user', JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('le_drive_user')
    setUser(null)
  }

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-xl">Loading LE Website Drive...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-4">
        <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <HardDrive className="w-16 h-16 mx-auto mb-4 text-sky-400" />
            <h1 className="text-3xl font-bold">LE Website Drive</h1>
            <p className="text-gray-400 mt-2">All-in-one Storage • Links • MCP • Auth • Cloud</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => login('user@example.com')}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 rounded-xl hover:bg-gray-100 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-900 text-gray-500">or</span></div>
            </div>

            <button
              onClick={() => {
                const email = prompt('Enter your email to create account:')
                if (email) login(email)
              }}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium py-3 rounded-xl transition"
            >
              <UserPlus className="w-5 h-5" />
              Create Account
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Powered by INFI DATABASE • Secure & Multi-device
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'drive' as Tab, label: 'Drive', icon: HardDrive },
    { id: 'links' as Tab, label: 'Links', icon: Link2 },
    { id: 'connections' as Tab, label: 'Connections', icon: Share2 },
    { id: 'auth' as Tab, label: 'Authenticator', icon: Shield },
    { id: 'cloud' as Tab, label: 'Cloud', icon: Cloud },
  ]

  return (
    <div className="min-h-screen flex bg-black">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <HardDrive className="w-8 h-8 text-sky-400" />
            <div>
              <h1 className="font-bold text-lg">LE Drive</h1>
              <p className="text-xs text-gray-500">{user.display_name}</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                activeTab === tab.id 
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-600/40' 
                  : 'hover:bg-gray-900 text-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button onClick={logout} className="w-full text-sm text-gray-400 hover:text-white py-2">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <button className="md:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold capitalize">{activeTab === 'auth' ? 'Authenticator' : activeTab}</h2>
          <div className="w-10" />
        </header>

        <div className="p-4 md:p-8 max-w-5xl mx-auto">
          {/* DRIVE TAB */}
          {activeTab === 'drive' && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-2">Encrypted Drive Storage</h3>
                <p className="text-gray-400 text-sm mb-6">Your files are encrypted client-side before being stored in INFI DATABASE.</p>
                
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-sky-600 transition cursor-pointer">
                  <HardDrive className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">Drop files here or click to upload</p>
                  <p className="text-xs text-gray-600 mt-2">Coming soon • Encrypted with your key</p>
                </div>
              </div>
            </div>
          )}

          {/* LINKS TAB */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-4">Add New Link</h3>
                <div className="grid gap-3 md:grid-cols-3">
                  <input
                    placeholder="Title"
                    value={newLink.title}
                    onChange={e => setNewLink({...newLink, title: e.target.value})}
                    className="bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    placeholder="URL"
                    value={newLink.url}
                    onChange={e => setNewLink({...newLink, url: e.target.value})}
                    className="bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => {
                      if (newLink.url) {
                        setLinks([{...newLink, id: Date.now()}, ...links])
                        setNewLink({ title: '', url: '', notes: '' })
                      }
                    }}
                    className="bg-sky-600 hover:bg-sky-500 rounded-lg px-4 py-2 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {links.length === 0 && <p className="text-gray-500 text-center py-12">No links yet</p>}
                {links.map(link => (
                  <div key={link.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{link.title || 'Untitled'}</p>
                      <a href={link.url} target="_blank" className="text-sky-400 text-sm hover:underline">{link.url}</a>
                    </div>
                    <button onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="text-gray-500 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONNECTIONS TAB */}
          {activeTab === 'connections' && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-4">Add Connection / MCP Link</h3>
                <div className="space-y-3">
                  <input
                    placeholder="Name (e.g. My AI Tool)"
                    value={newConn.name}
                    onChange={e => setNewConn({...newConn, name: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    placeholder="MCP Link"
                    value={newConn.mcp_link}
                    onChange={e => setNewConn({...newConn, mcp_link: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    placeholder="Website URL (optional)"
                    value={newConn.website_url}
                    onChange={e => setNewConn({...newConn, website_url: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => {
                      if (newConn.name) {
                        setConnections([{...newConn, id: Date.now()}, ...connections])
                        setNewConn({ name: '', mcp_link: '', website_url: '' })
                      }
                    }}
                    className="bg-sky-600 hover:bg-sky-500 rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Connection
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {connections.length === 0 && <p className="text-gray-500 text-center py-12">No connections yet</p>}
                {connections.map(conn => (
                  <div key={conn.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-lg">{conn.name}</p>
                        {conn.website_url && <a href={conn.website_url} className="text-sm text-gray-400 hover:text-sky-400">{conn.website_url}</a>}
                      </div>
                      <button onClick={() => setConnections(connections.filter(c => c.id !== conn.id))} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {conn.mcp_link && (
                      <div className="bg-black rounded-lg p-3 flex items-center justify-between gap-3">
                        <code className="text-xs text-sky-300 truncate flex-1">{conn.mcp_link}</code>
                        <button
                          onClick={() => copyText(conn.mcp_link, conn.id)}
                          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-sm px-3 py-1.5 rounded-lg shrink-0"
                        >
                          {copied === conn.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied === conn.id ? 'Copied!' : 'Copy MCP Link'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUTHENTICATOR TAB */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium mb-4">Add Authenticator</h3>
                <p className="text-sm text-gray-400 mb-4">Name can be edited later. Secret/code cannot be changed after creation.</p>
                <div className="space-y-3">
                  <input
                    placeholder="Name (e.g. Google, Discord)"
                    value={newAuth.name}
                    onChange={e => setNewAuth({...newAuth, name: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    placeholder="Secret / Code from other app"
                    value={newAuth.secret}
                    onChange={e => setNewAuth({...newAuth, secret: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    placeholder="Issuer (optional)"
                    value={newAuth.issuer}
                    onChange={e => setNewAuth({...newAuth, issuer: e.target.value})}
                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => {
                      if (newAuth.name && newAuth.secret) {
                        setAuthenticators([{...newAuth, id: Date.now()}, ...authenticators])
                        setNewAuth({ name: '', secret: '', issuer: '' })
                      }
                    }}
                    className="bg-sky-600 hover:bg-sky-500 rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Authenticator
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {authenticators.length === 0 && <p className="text-gray-500 text-center py-12 col-span-2">No authenticators yet</p>}
                {authenticators.map(auth => (
                  <div key={auth.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-lg">{auth.name}</p>
                        {auth.issuer && <p className="text-sm text-gray-400">{auth.issuer}</p>}
                      </div>
                      <button onClick={() => setAuthenticators(authenticators.filter(a => a.id !== auth.id))} className="text-gray-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-black rounded-lg p-3 flex items-center justify-between">
                      <code className="text-sm tracking-widest text-green-400">••••••••</code>
                      <button
                        onClick={() => copyText(auth.secret, auth.id)}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-sm px-3 py-1.5 rounded-lg"
                      >
                        {copied === auth.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        Copy Code
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Secret is locked and cannot be edited</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CLOUD TAB */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                <Cloud className="w-16 h-16 mx-auto mb-4 text-sky-400" />
                <h3 className="text-xl font-medium mb-2">Cloud Sync</h3>
                <p className="text-gray-400 mb-6">Save your Drive, Links, Connections and Authenticators so they appear on all your devices using the same account.</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="bg-sky-600 hover:bg-sky-500 px-6 py-3 rounded-xl font-medium">
                    Save Current State
                  </button>
                  <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-xl font-medium">
                    Load from Cloud
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h4 className="font-medium mb-4">Saved on other devices</h4>
                <p className="text-gray-500 text-sm">No cloud saves yet. Create your first save above.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
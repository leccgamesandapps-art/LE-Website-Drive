import { HardDrive, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function DocPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <Link href="/web" className="flex items-center gap-2">
          <HardDrive className="w-6 h-6 text-sky-400" />
          <span className="font-bold">LE Website Drive</span>
        </Link>
        <Link href="/web" className="text-sm text-sky-400 hover:underline">Login</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Documentation</h1>
        <p className="text-zinc-400 mb-10">Official LE Website Drive • Powered by INFI DATABASE</p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">What is LE Website Drive?</h2>
          <p className="text-zinc-300 leading-relaxed">
            An all-in-one personal system that combines encrypted Drive storage, Link database,
            MCP Connections, Authenticator codes, and multi-device Cloud sync — all backed by a real Supabase database.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Pages</h2>
          <ul className="space-y-2 text-zinc-300">
            <li><code className="text-sky-400">/web</code> — Login & Register</li>
            <li><code className="text-sky-400">/web/doc</code> — This documentation</li>
            <li><code className="text-sky-400">/web/dashboard</code> — Main dashboard</li>
            <li><code className="text-sky-400">/web/dashboard/drive</code> — Encrypted Drive</li>
            <li><code className="text-sky-400">/web/dashboard/connection</code> — MCP Connections</li>
            <li><code className="text-sky-400">/web/dashboard/auth</code> — Authenticator</li>
            <li><code className="text-sky-400">/web/dashboard/account</code> — Account settings</li>
            <li><code className="text-sky-400">/web/api/MCP</code> — Official MCP Server endpoint</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">MCP Server</h2>
          <p className="text-zinc-300 mb-3">
            Other AIs (including Grok) can connect to your data using this endpoint as a custom MCP connector:
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <code className="text-sky-300 text-sm break-all">
              https://le-website-drive-web-developer-560b.vercel.app/web/api/MCP
            </code>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Official Links</h2>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/leccgamesandapps-art/LE-Website-Drive" target="_blank"
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl text-sm hover:bg-zinc-800">
              <Github className="w-4 h-4" /> GitHub Repo
            </a>
            <a href="https://github.com/leccgamesandapps-art" target="_blank"
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-xl text-sm hover:bg-zinc-800">
              <Github className="w-4 h-4" /> Profile
            </a>
            <a href="https://le-website-drive-web-developer-560b.vercel.app" target="_blank"
              className="flex items-center gap-2 bg-sky-600 px-4 py-2 rounded-xl text-sm hover:bg-sky-500">
              <ExternalLink className="w-4 h-4" /> Live Website
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
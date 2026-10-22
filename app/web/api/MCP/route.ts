import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  return NextResponse.json({
    name: 'LE Website Drive MCP',
    version: '1.0.0',
    description: 'Official MCP Server for LE Website Drive. Access Drive, Links, Connections and Authenticators.',
    website: 'https://le-website-drive-web-developer-560b.vercel.app',
    github: 'https://github.com/leccgamesandapps-art/LE-Website-Drive',
    profile: 'https://github.com/leccgamesandapps-art',
    tools: [
      { name: 'list_links', description: 'List all saved links' },
      { name: 'list_connections', description: 'List MCP connections and linked apps' },
      { name: 'list_authenticators', description: 'List authenticator names (secrets never returned)' },
      { name: 'get_cloud_saves', description: 'Get cloud save history' }
    ]
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tool, user_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    if (tool === 'list_links') {
      const { data } = await supabase.from('links').select('id, title, url, notes, created_at').eq('user_id', user_id)
      return NextResponse.json({ tool, data: data || [] })
    }

    if (tool === 'list_connections') {
      const { data } = await supabase.from('connections').select('id, name, mcp_link, website_url, description, created_at').eq('user_id', user_id)
      return NextResponse.json({ tool, data: data || [] })
    }

    if (tool === 'list_authenticators') {
      const { data } = await supabase.from('authenticators').select('id, name, issuer, created_at').eq('user_id', user_id)
      return NextResponse.json({ tool, data: data || [] })
    }

    if (tool === 'get_cloud_saves') {
      const { data } = await supabase.from('cloud_saves').select('id, device_name, save_type, created_at').eq('user_id', user_id)
      return NextResponse.json({ tool, data: data || [] })
    }

    return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
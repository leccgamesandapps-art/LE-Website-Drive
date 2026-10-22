import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Basic MCP-compatible endpoint
// Other AIs can call this to discover tools and data

export async function GET(req: NextRequest) {
  return NextResponse.json({
    name: 'LE Website Drive MCP',
    version: '1.0.0',
    description: 'Official MCP server for LE Website Drive - Access Drive, Links, Connections and Authenticators',
    tools: [
      {
        name: 'list_links',
        description: 'List all saved links for the authenticated user'
      },
      {
        name: 'list_connections',
        description: 'List all MCP connections and linked apps'
      },
      {
        name: 'list_authenticators',
        description: 'List authenticator names (secrets are never returned)'
      },
      {
        name: 'get_cloud_saves',
        description: 'Get cloud save history'
      }
    ],
    website: 'https://le-website-drive-web-developer-560b.vercel.app',
    github: 'https://github.com/leccgamesandapps-art/LE-Website-Drive'
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tool, user_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id required' }, { status: 400 })
    }

    if (tool === 'list_links') {
      const { data } = await supabase.from('links').select('id, title, url, notes, created_at').eq('user_id', user_id)
      return NextResponse.json({ tool, data })
    }

    if (tool === 'list_connections') {
      const { data } = await supabase.from('connections').select('id, name, mcp_link, website_url, description, created_at').eq('user_id', user_id)
      return NextResponse.json({ tool, data })
    }

    if (tool === 'list_authenticators') {
      // Never return the actual secret
      const { data } = await supabase.from('authenticators').select('id, name, issuer, created_at').eq('user_id', user_id)
      return NextResponse.json({ tool, data })
    }

    if (tool === 'get_cloud_saves') {
      const { data } = await supabase.from('cloud_saves').select('id, device_name, save_type, created_at').eq('user_id', user_id)
      return NextResponse.json({ tool, data })
    }

    return NextResponse.json({ error: 'Unknown tool' }, { status: 400 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
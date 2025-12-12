import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import { serialize } from 'cookie'
import type { Database, VendorTransparency } from '../../../utils/supabase/types'

function createClient(req: NextApiRequest, res: NextApiResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing required Supabase environment variables')
  }

  return createServerClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map((name) => ({ 
            name, 
            value: req.cookies[name] || '' 
          }))
        },
        setAll(cookiesToSet) {
          const cookies = cookiesToSet.map(({ name, value, options }) => {
            return serialize(name, value, {
              path: '/',
              httpOnly: options?.httpOnly,
              secure: options?.secure,
              sameSite: options?.sameSite,
              maxAge: options?.maxAge,
              ...options
            })
          })
          
          const existingCookies = res.getHeader('Set-Cookie')
          const allCookies = existingCookies 
            ? (Array.isArray(existingCookies) ? [...existingCookies.map(String), ...cookies] : [String(existingCookies), ...cookies])
            : cookies
            
          res.setHeader('Set-Cookie', allCookies)
        }
      }
    }
  )
}

export type TransparencyMap = Record<string, {
  indicators: string[]
  transparency_note: string
}>

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createClient(req, res)
    
    switch (req.method) {
      case 'GET':
        const { data: transparencyData, error: transparencyError } = await supabase
          .from('vendor_transparency')
          .select('edr_name, indicators, transparency_note')

        if (transparencyError) {
          console.error('Database error:', transparencyError)
          return res.status(500).json({ error: 'Failed to fetch transparency data' })
        }

        // Transform to a map keyed by edr_name for easy lookup
        const transparencyMap: TransparencyMap = {}
        for (const vendor of (transparencyData as VendorTransparency[])) {
          transparencyMap[vendor.edr_name] = {
            indicators: vendor.indicators || [],
            transparency_note: vendor.transparency_note || ''
          }
        }

        return res.status(200).json(transparencyMap)

      default:
        res.setHeader('Allow', ['GET'])
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

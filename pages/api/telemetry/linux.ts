import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import { serialize } from 'cookie'
import type { Database, LinuxTelemetryWithScores } from '../../../utils/supabase/types'

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
          
          // Preserve existing cookies if any
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createClient(req, res)
    switch (req.method) {
      case 'GET':
        // Fetch Linux telemetry data with scores
        const { data: telemetryData, error: telemetryError } = await supabase
          .from('linux_telemetry')
          .select(`
            *,
            linux_table_results (
              id,
              edr_name,
              status,
              explanation,
              created_at,
              updated_at
            )
          `)
          .order('created_at', { ascending: true })

        if (telemetryError) {
          console.error('Database error:', telemetryError)
          return res.status(500).json({ error: 'Failed to fetch telemetry data' })
        }

        // Transform data to match the expected format for the frontend
        const transformedData = (telemetryData as LinuxTelemetryWithScores[]).map(item => {
          const result: any = {
            'Telemetry Feature Category': item.category,
            'Sub-Category': item.subcategory,
            'optional': item.optional
          }
          
          // Add each EDR's score as a property
          item.linux_table_results.forEach(score => {
            result[score.edr_name] = score.status
          })
          
          return result
        })

        return res.status(200).json(transformedData)

      case 'POST':
        // Add new telemetry category (for future use)
        const { category, subcategory, optional = true } = req.body
        
        if (!category || !subcategory) {
          return res.status(400).json({ error: 'Category and subcategory are required' })
        }

        const { data: newTelemetry, error: insertError } = await supabase
          .from('linux_telemetry')
          .insert({ category, subcategory, optional })
          .select()
          .single()

        if (insertError) {
          console.error('Insert error:', insertError)
          return res.status(500).json({ error: 'Failed to create telemetry category' })
        }

        return res.status(201).json(newTelemetry)

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
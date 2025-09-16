import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import { serialize } from 'cookie'
import type { Database } from '../../../utils/supabase/types'
import type { PostgrestError } from '@supabase/supabase-js'

function createClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for admin operations
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

const WINDOWS_JSON_URL = 'https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_windows.json'
const LINUX_JSON_URL = 'https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_linux.json'

interface TelemetryEntry {
  'Telemetry Feature Category': string | null
  'Sub-Category': string
  [key: string]: string | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  // Basic security - require API key
  const apiKey = req.headers.authorization
  if (!apiKey || apiKey !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { platform } = req.query
  
  if (platform !== 'windows' && platform !== 'linux') {
    return res.status(400).json({ error: 'Platform must be "windows" or "linux"' })
  }

  const supabase = createClient(req, res)

  try {
    const jsonUrl = platform === 'windows' ? WINDOWS_JSON_URL : LINUX_JSON_URL

    // Fetch data from GitHub
    const response = await fetch(jsonUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const telemetryData = await response.json() as TelemetryEntry[]
    
    console.log(`Syncing ${telemetryData.length} ${platform} entries`)

    const processedCategories = new Map<string, string>()
    let lastCategory = ''
    let updated = 0
    let inserted = 0

    for (const entry of telemetryData) {
      const category = entry['Telemetry Feature Category'] || lastCategory
      const subcategory = entry['Sub-Category']
      
      if (category) {
        lastCategory = category
      }

      const categoryKey = `${category}-${subcategory}`
      let telemetryId: string

      // Check if telemetry category exists
      if (!processedCategories.has(categoryKey)) {
        let existingTelemetry: { id: string } | null = null
        let selectError: PostgrestError | null = null

        // Type-safe query based on platform
        if (platform === 'windows') {
          const result = await supabase
            .from('windows_telemetry')
            .select('id')
            .eq('category', category)
            .eq('subcategory', subcategory)
            .single()
          existingTelemetry = result.data
          selectError = result.error
        } else {
          const result = await supabase
            .from('linux_telemetry')
            .select('id')
            .eq('category', category)
            .eq('subcategory', subcategory)
            .single()
          existingTelemetry = result.data
          selectError = result.error
        }

        if (existingTelemetry && !selectError) {
          telemetryId = existingTelemetry.id
        } else {
          let newTelemetry: { id: string } | null = null
          let insertError: PostgrestError | null = null

          // Type-safe insert based on platform
          if (platform === 'windows') {
            const result = await supabase
              .from('windows_telemetry')
              .insert({ category, subcategory })
              .select('id')
              .single()
            newTelemetry = result.data
            insertError = result.error
          } else {
            const result = await supabase
              .from('linux_telemetry')
              .insert({ category, subcategory })
              .select('id')
              .single()
            newTelemetry = result.data
            insertError = result.error
          }

          if (insertError || !newTelemetry) {
            console.error('Error inserting telemetry:', insertError)
            continue
          }
          
          telemetryId = newTelemetry.id
          inserted++
        }
        
        processedCategories.set(categoryKey, telemetryId)
      } else {
        telemetryId = processedCategories.get(categoryKey)!
      }

      // Update scores
      for (const [edrName, status] of Object.entries(entry)) {
        if (edrName !== 'Telemetry Feature Category' && edrName !== 'Sub-Category' && status !== null) {
          let upsertError: PostgrestError | null = null

          // Type-safe upsert based on platform
          if (platform === 'windows') {
            const result = await supabase
              .from('windows_table_results')
              .upsert({
                telemetry_id: telemetryId,
                edr_name: edrName,
                status: status,
                explanation: null
              }, {
                onConflict: 'telemetry_id,edr_name'
              })
            upsertError = result.error
          } else {
            const result = await supabase
              .from('linux_table_results')
              .upsert({
                telemetry_id: telemetryId,
                edr_name: edrName,
                status: status,
                explanation: null
              }, {
                onConflict: 'telemetry_id,edr_name'
              })
            upsertError = result.error
          }

          if (upsertError) {
            console.error(`Error upserting score for ${edrName}:`, upsertError)
          } else {
            updated++
          }
        }
      }
    }

    return res.status(200).json({ 
      message: `Successfully synced ${platform} data`,
      stats: {
        categories: processedCategories.size,
        inserted,
        updated
      }
    })

  } catch (error) {
    console.error('Sync error:', error)
    return res.status(500).json({ error: 'Failed to sync data' })
  }
}

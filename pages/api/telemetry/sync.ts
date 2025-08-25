import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import { serialize } from 'cookie'
import type { Database } from '../../../utils/supabase/types'

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
            ? (Array.isArray(existingCookies) ? [...existingCookies, ...cookies] : [existingCookies, ...cookies])
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
    const telemetryTable = platform === 'windows' ? 'windows_telemetry' : 'linux_telemetry'
    const scoresTable = platform === 'windows' ? 'windows_table_results' : 'linux_table_results'

    // Fetch data from GitHub
    const response = await fetch(jsonUrl)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const telemetryData = await response.json() as TelemetryEntry[]
    
    console.log(`Syncing ${telemetryData.length} ${platform} entries`)

    let processedCategories = new Map<string, string>()
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
        const { data: existingTelemetry } = await supabase
          .from(telemetryTable as any)
          .select('id')
          .eq('category', category)
          .eq('subcategory', subcategory)
          .single()

        if (existingTelemetry) {
          telemetryId = existingTelemetry.id
        } else {
          const { data: newTelemetry, error } = await supabase
            .from(telemetryTable as any)
            .insert({ category, subcategory })
            .select('id')
            .single()

          if (error) {
            console.error('Error inserting telemetry:', error)
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
          const { error } = await supabase
            .from(scoresTable as any)
            .upsert({
              telemetry_id: telemetryId,
              edr_name: edrName,
              status: status,
              explanation: null
            }, {
              onConflict: 'telemetry_id,edr_name'
            })

          if (error) {
            console.error(`Error upserting score for ${edrName}:`, error)
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
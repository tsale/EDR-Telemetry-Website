import type { NextApiRequest, NextApiResponse } from 'next'
import { createServerClient } from '@supabase/ssr'
import { serialize } from 'cookie'
import type { Database, WindowsTelemetryWithScores, LinuxTelemetryWithScores } from '../../../utils/supabase/types'

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

interface CoverageAnalysis {
  telemetryId: string
  platform: 'windows' | 'linux'
  category: string
  subcategory: string
  totalVendors: number
  implementedCount: number
  coveragePercentage: number
  canBePromoted: boolean
  isOptional: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const supabase = createClient(req, res)
    switch (req.method) {
      case 'GET':
        // Calculate coverage for both Windows and Linux telemetry
        const coverageAnalysis: CoverageAnalysis[] = []

        // Windows coverage analysis
        const { data: windowsData, error: windowsError } = await supabase
          .from('windows_telemetry')
          .select(`
            *,
            windows_table_results (
              id,
              edr_name,
              status,
              explanation,
              created_at,
              updated_at
            )
          `)
          .order('created_at', { ascending: true })

        if (windowsError) {
          console.error('Windows database error:', windowsError)
          return res.status(500).json({ error: 'Failed to fetch Windows telemetry data' })
        }

        // Linux coverage analysis  
        const { data: linuxData, error: linuxError } = await supabase
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

        if (linuxError) {
          console.error('Linux database error:', linuxError)
          return res.status(500).json({ error: 'Failed to fetch Linux telemetry data' })
        }

        // Process Windows data
        if (windowsData) {
          for (const telemetry of windowsData as WindowsTelemetryWithScores[]) {
            const results = telemetry.windows_table_results
            const totalVendors = results.length
            const implementedCount = results.filter(result => 
              result.status === 'Yes' || 
              result.status === 'Via EnablingTelemetry' ||
              result.status === 'Partially' ||
              result.status === 'Via EventLogs'
            ).length
            
            const coveragePercentage = totalVendors > 0 ? (implementedCount / totalVendors) * 100 : 0
            
            coverageAnalysis.push({
              telemetryId: telemetry.id,
              platform: 'windows',
              category: telemetry.category,
              subcategory: telemetry.subcategory,
              totalVendors,
              implementedCount,
              coveragePercentage,
              canBePromoted: coveragePercentage >= 75 && telemetry.optional,
              isOptional: telemetry.optional
            })
          }
        }

        // Process Linux data
        if (linuxData) {
          for (const telemetry of linuxData as LinuxTelemetryWithScores[]) {
            const results = telemetry.linux_table_results
            const totalVendors = results.length
            const implementedCount = results.filter(result => 
              result.status === 'Yes' || 
              result.status === 'Via EnablingTelemetry' ||
              result.status === 'Partially' ||
              result.status === 'Via EventLogs'
            ).length
            
            const coveragePercentage = totalVendors > 0 ? (implementedCount / totalVendors) * 100 : 0
            
            coverageAnalysis.push({
              telemetryId: telemetry.id,
              platform: 'linux',
              category: telemetry.category,
              subcategory: telemetry.subcategory,
              totalVendors,
              implementedCount,
              coveragePercentage,
              canBePromoted: coveragePercentage >= 75 && telemetry.optional,
              isOptional: telemetry.optional
            })
          }
        }

        // Filter based on query parameters
        const { platform, canBePromoted, threshold } = req.query
        let filteredAnalysis = coverageAnalysis

        if (platform && (platform === 'windows' || platform === 'linux')) {
          filteredAnalysis = filteredAnalysis.filter(item => item.platform === platform)
        }

        if (canBePromoted === 'true') {
          filteredAnalysis = filteredAnalysis.filter(item => item.canBePromoted)
        }

        if (threshold) {
          const thresholdNum = parseFloat(threshold as string)
          if (!isNaN(thresholdNum)) {
            filteredAnalysis = filteredAnalysis.filter(item => item.coveragePercentage >= thresholdNum)
          }
        }

        return res.status(200).json({
          analysis: filteredAnalysis,
          summary: {
            total: coverageAnalysis.length,
            canBePromoted: coverageAnalysis.filter(item => item.canBePromoted).length,
            windows: coverageAnalysis.filter(item => item.platform === 'windows').length,
            linux: coverageAnalysis.filter(item => item.platform === 'linux').length,
            averageCoverage: coverageAnalysis.reduce((acc, item) => acc + item.coveragePercentage, 0) / coverageAnalysis.length
          }
        })

      case 'POST':
        // Update optional status based on coverage
        const { telemetryIds, platform: updatePlatform } = req.body
        
        if (!telemetryIds || !Array.isArray(telemetryIds) || !updatePlatform) {
          return res.status(400).json({ error: 'telemetryIds array and platform are required' })
        }

        if (updatePlatform !== 'windows' && updatePlatform !== 'linux') {
          return res.status(400).json({ error: 'Invalid platform. Must be "windows" or "linux"' })
        }
        const tableName = updatePlatform === 'windows'
          ? 'windows_telemetry'
          : 'linux_telemetry'
        
        const { data: updatedTelemetry, error: updateError } = await supabase
          .from(tableName)
          .update({ optional: false })
          .in('id', telemetryIds)
          .select()

        if (updateError) {
          console.error('Update error:', updateError)
          return res.status(500).json({ error: 'Failed to update telemetry optional status' })
        }

        return res.status(200).json({ 
          message: `Updated ${updatedTelemetry?.length || 0} telemetry items`,
          updatedItems: updatedTelemetry 
        })

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
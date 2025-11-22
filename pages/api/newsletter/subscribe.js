import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'
import { logger } from '../../../utils/logger'

const WINDOW_MS = 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 10
const ipRequestMap = new Map()

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string') {
    return xff.split(',')[0].trim()
  }
  if (Array.isArray(xff) && xff.length > 0) {
    return xff[0].split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

function isRateLimited(ip) {
  const now = Date.now()
  const entry = ipRequestMap.get(ip) || []
  const recent = entry.filter((ts) => now - ts < WINDOW_MS)
  recent.push(now)
  ipRequestMap.set(ip, recent)
  return recent.length > MAX_REQUESTS_PER_WINDOW
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const ip = getClientIp(req)

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' })
  }

  let email

  try {
    email = (req.body?.email || '').trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(500).json({ error: 'Supabase environment variables not configured' })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const token = randomBytes(24).toString('hex')

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, is_active: false, confirmation_token: token }])

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email already subscribed' })
      }
      throw error
    }

    // We are not sending any emails from this endpoint; just store the subscription.

    return res.status(200).json({ success: true })
  } catch (err) {
    logger.error('newsletter_subscribe_error', {
      email,
      ip,
      err
    })
    return res.status(500).json({ error: 'Internal server error' })
  }
 }

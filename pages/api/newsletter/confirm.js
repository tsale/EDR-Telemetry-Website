import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.query.token
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Missing token' })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Supabase environment variables not configured' })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  try {
    // Step 1: Look up the subscriber by confirmation_token, selecting minimal fields
    const { data: lookupData, error: lookupError } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('confirmation_token', token)
      .limit(1)

    if (lookupError) {
      throw lookupError
    }

    if (!lookupData || lookupData.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    const subscriber = lookupData[0]

    // If already confirmed, treat as idempotent and redirect as success
    if (subscriber.is_active) {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`
      const redirect = `${baseUrl}/blog?subscribed=1`

      res.writeHead(302, { Location: redirect })
      res.end()
      return
    }

    // Step 2: Perform the update, selecting only id to confirm success
    const { data: updateData, error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: true,
        confirmed_at: new Date().toISOString(),
        confirmation_token: null
      })
      .eq('id', subscriber.id)
      .select('id')
      .limit(1)

    if (updateError) {
      throw updateError
    }

    if (!updateData || updateData.length === 0) {
      return res.status(500).json({ error: 'Failed to confirm subscription' })
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`
    const redirect = `${baseUrl}/blog?subscribed=1`

    res.writeHead(302, { Location: redirect })
    res.end()
  } catch (e) {
    console.error('Confirm error:', e)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

# Newsletter Subscribers Integration Guide

## Overview
This document explains how to integrate the newsletter subscription feature with Supabase.

## Database Setup

### 1. Run the Migration
Execute the migration file to create the `newsletter_subscribers` table:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in your Supabase dashboard
```

The migration file is located at:
- `supabase/migrations/20250122_create_newsletter_subscribers.sql`

Alternatively, you can run the SQL commands from:
- `supabase/schema.sql` (lines 103-141)

### 2. Table Schema

The `newsletter_subscribers` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Optional subscriber name |
| `email` | TEXT | Email address (unique, required) |
| `subscribed_at` | TIMESTAMP | When the user subscribed |
| `is_active` | BOOLEAN | Whether subscription is active (default: true) |
| `unsubscribed_at` | TIMESTAMP | When user unsubscribed (if applicable) |
| `created_at` | TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### 3. Security Policies

Row Level Security (RLS) is enabled with the following policies:
- **Public Insert**: Anyone can subscribe (insert records)
- **Public Read**: Anyone can read subscription data
- **Public Update**: Anyone can update subscriptions (for unsubscribe functionality)

## Frontend Integration

### Current Implementation
The newsletter form is located in `pages/blog.js` in the hero section.

### To Complete the Integration:

1. **Install Supabase Client** (if not already installed):
```bash
npm install @supabase/supabase-js
```

2. **Update the form handler** in `pages/blog.js`:

Replace the TODO section in `handleNewsletterSubmit` function:

```javascript
import { supabase } from '../utils/supabase/client'

const handleNewsletterSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          name: name || null,
          email: email,
        }
      ])
      .select();

    if (error) {
      // Handle duplicate email error gracefully
      if (error.code === '23505') {
        setSubmitStatus('error');
        alert('This email is already subscribed!');
      } else {
        throw error;
      }
    } else {
      setSubmitStatus('success');
      setEmail('');
      setName('');
    }
  } catch (error) {
    console.error('Newsletter signup error:', error);
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
}
```

## API Endpoint (Optional)

For better security and to add email validation/confirmation, create an API route:

**File**: `pages/api/newsletter/subscribe.js`

```javascript
import { supabase } from '../../../utils/supabase/server'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ name: name || null, email }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email already subscribed' });
      }
      throw error;
    }

    // TODO: Send confirmation email here
    // You can integrate with SendGrid, Mailgun, or AWS SES

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

Then update the form handler to use the API:

```javascript
const handleNewsletterSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);

  try {
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Subscription failed');
    }

    setSubmitStatus('success');
    setEmail('');
    setName('');
  } catch (error) {
    console.error('Newsletter signup error:', error);
    setSubmitStatus('error');
  } finally {
    setIsSubmitting(false);
  }
}
```

## Email Confirmation (Recommended)

To add email confirmation:

1. **Double Opt-in**: Send a confirmation email with a unique token
2. **Add token field** to the table:
```sql
ALTER TABLE newsletter_subscribers 
ADD COLUMN confirmation_token TEXT,
ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE;
```

3. **Create confirmation endpoint**: `/api/newsletter/confirm/[token].js`

## Unsubscribe Functionality

Create an unsubscribe page at `pages/unsubscribe.js`:

```javascript
// Handle unsubscribe by updating is_active to false
const { error } = await supabase
  .from('newsletter_subscribers')
  .update({ 
    is_active: false, 
    unsubscribed_at: new Date().toISOString() 
  })
  .eq('email', email);
```

## Viewing Subscribers

Query subscribers in your Supabase dashboard or create an admin panel:

```sql
-- Get all active subscribers
SELECT * FROM newsletter_subscribers 
WHERE is_active = true 
ORDER BY subscribed_at DESC;

-- Get subscriber count
SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true;
```

## Next Steps

1. ✅ Database table created
2. ⏳ Complete Supabase client integration in `pages/blog.js`
3. ⏳ (Optional) Create API endpoint for better security
4. ⏳ (Recommended) Add email confirmation flow
5. ⏳ (Recommended) Integrate with email service (SendGrid, etc.)
6. ⏳ Create unsubscribe page
7. ⏳ Set up automated email campaigns for new blog posts

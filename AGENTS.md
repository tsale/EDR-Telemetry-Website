# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

This is the EDR Telemetry Website - a Next.js application that documents and compares telemetry capabilities across various EDR (Endpoint Detection and Response) solutions for Windows, Linux, and macOS platforms. The website provides detailed information about telemetry categories, scores, and platform-specific capabilities.

## Development Commands

Connect to your local Supabase PostgreSQL instance for setup and testing:
`psql "postgres://postgres:pP85VHs%25y%2AWH4j7xeGzJ@db.eetiupvmlvzgfxuxzauf.supabase.co:5432/postgres"`
This allows you to:
- Create and verify table schemas
- Test queries and relationships 
- Import initial data
- Debug any issues directly

```bash
# Install dependencies
npm install

# Development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture Overview

### Next.js Structure
- **File-based routing**: Pages are defined in the `pages/` directory
- **TemplatePage component**: All pages use this wrapper component for consistent layout and navigation
- **Static assets**: Located in `public/` directory including telemetry data files
- **Styles**: CSS files organized per page/component in `styles/` directory

### Key Technologies
- **Next.js 15.2+**: React framework with built-in optimizations
- **React 18+**: UI library with hooks and modern patterns
- **Supabase**: PostgreSQL database with Row Level Security (RLS)
- **Chart.js**: Data visualization for telemetry statistics
- **Google Analytics**: Web analytics integration
- **Vercel Speed Insights**: Performance monitoring

### Analytics Integration
- **Google Analytics**: Integrated in _app.js with event tracking for:
  - Page views and route changes
  - Scroll depth tracking
  - Time spent on pages
  - Outbound link clicks
  - File downloads
- **Vercel Analytics**: Speed insights and performance monitoring

## Component Architecture

### TemplatePage Component
Central layout component that provides:
- Site navigation with responsive mobile menu
- Search functionality (⌘K keyboard shortcut)
- Footer with social links and site map
- SEO meta tags and structured data
- Analytics integration

### Page Structure
All pages follow this pattern:
```jsx
import TemplatePage from '../components/TemplatePage'

export default function PageName() {
  return (
    <TemplatePage title="Page Title - EDR Telemetry" description="Page description">
      <div className="page-content">
        {/* Page-specific content */}
      </div>
    </TemplatePage>
  )
}
```

### Navigation Structure
- **Platforms**: Windows, Linux, macOS (dropdown menu)
- **Eligibility**: EDR telemetry eligibility criteria
- **Scores**: Comparative scoring system
- **Statistics**: Telemetry statistics and visualizations
- **Support Us**: Project support and sponsorship information
- **Premium Services**: Commercial offerings
- **About**: Project information

## Security Configuration

### Content Security Policy
Comprehensive CSP headers configured in next.config.js including:
- Script sources for analytics and external services
- Style sources for fonts and external stylesheets
- Frame sources for embedded content
- Connect sources for API endpoints

### PostHog Proxy
Custom rewrites proxy PostHog analytics through the application domain to avoid ad blockers:
- `/ingest/static/*` → `https://us-assets.i.posthog.com/static/*`
- `/ingest/*` → `https://us.i.posthog.com/*`

## Data Management

### Static Data Files
- **Historical data**: `public/data/historical/` contains platform history JSON files
- **Roadmap data**: `public/data/roadmap.json` for project planning
- **Images**: Platform comparisons and logos in `public/images/`

### Utility Functions
Common utilities in `utils/common.js`:
- Date formatting
- HTML sanitization
- Sorting and data manipulation
- Mobile detection
- Performance optimization (debouncing)
- Color coding for percentage displays

## Database Security

### Supabase Row Level Security (RLS)
The application uses Supabase PostgreSQL with Row Level Security enabled on all tables:

- **Public Read Access**: Anonymous users can read all telemetry data via the anon key
- **Write Operations**: Only available to server-side API routes using the service role key
- **RLS Policies**: Configured to allow public reads while restricting modifications

### Environment Variables Security Model
```
NEXT_PUBLIC_SUPABASE_URL     - Safe to expose (API endpoint)
NEXT_PUBLIC_SUPABASE_ANON_KEY - Safe to expose (read-only with RLS)
SUPABASE_SERVICE_ROLE_KEY    - Server-side only (bypasses RLS)
```

### Database Access Patterns
- **Client-side**: No direct database access (browser client unused)
- **API Routes**: All database operations go through Next.js API routes
- **Service Role**: Used only in server-side code for data synchronization
- **Anon Key**: Used for public read operations through RLS policies

### Migration Management
SQL migrations are stored in `supabase/migrations/` and should be run via:
```bash
# Connect to database and run migration
psql "postgres://..." < supabase/migrations/filename.sql
```

## Development Guidelines

### Page Development
1. Always use TemplatePage component as the wrapper
2. Include proper title and description for SEO
3. Use semantic HTML and accessibility best practices
4. Follow existing CSS class naming conventions

### Styling
- Global styles in `styles/globals.css`
- Page-specific styles in dedicated CSS files
- Responsive design with mobile-first approach
- CSS Grid and Flexbox for layout

### Analytics
- Page views are automatically tracked
- Custom events should follow existing patterns in _app.js
- PostHog integration provides user behavior insights

### Search Functionality
- Global search available via ⌘K shortcut
- Search component handles site-wide content indexing
- Mobile-responsive search interface

## Deployment

- **Platform**: Vercel (configured via vercel.json)
- **Build command**: `npm run build`
- **Framework**: Next.js with standalone output
- **Environment**: Configured for production optimizations
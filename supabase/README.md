# Supabase Integration Setup

This guide explains how to set up and use the PostgreSQL database with Supabase for the EDR Telemetry Website.

## Prerequisites

1. A local Supabase instance running
2. Environment variables configured
3. Database schema created

## Setup Instructions

### 1. Environment Variables

Update your `.env` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Local PostgreSQL Connection (for psql access)
DATABASE_URL=postgres://postgres:your-super-secret-and-long-postgres-password@localhost:5432/postgres
```

### 2. Database Schema Setup

Connect to your local PostgreSQL database and run the schema:

```bash
psql "postgres://postgres:your-super-secret-and-long-postgres-password@localhost:5432/postgres"
```

Then execute the schema file:

```sql
\i supabase/schema.sql
```

Or copy and paste the contents of `supabase/schema.sql` into your database.

### 3. Data Migration

Once the schema is set up, migrate the existing JSON data:

```bash
npm run migrate-data
```

This will:
- Fetch data from the GitHub JSON files
- Clear existing database tables
- Import all Windows and Linux telemetry data
- Set up the relationships between categories and scores

### 4. Verify Setup

You can verify the migration worked by checking the tables:

```sql
-- Check telemetry categories
SELECT COUNT(*) FROM windows_telemetry;
SELECT COUNT(*) FROM linux_telemetry;

-- Check scores
SELECT COUNT(*) FROM windows_table_results;
SELECT COUNT(*) FROM linux_table_results;

-- View sample data
SELECT wt.category, wt.subcategory, ws.edr_name, ws.status 
FROM windows_telemetry wt
JOIN windows_table_results ws ON wt.id = ws.telemetry_id
LIMIT 10;
```

## Database Schema

The database consists of four main tables:

### `windows_telemetry` & `linux_telemetry`
- `id` - UUID primary key
- `category` - Telemetry Feature Category
- `subcategory` - Sub-Category
- `created_at` - Timestamp
- `updated_at` - Timestamp

### `windows_table_results` & `linux_table_results`
- `id` - UUID primary key
- `telemetry_id` - Foreign key to telemetry table
- `edr_name` - EDR solution name
- `status` - Implementation status (Yes/No/Partially/etc.)
- `explanation` - Optional explanation for "Partially" status
- `created_at` - Timestamp
- `updated_at` - Timestamp

## API Endpoints

The following API endpoints are available:

- `GET /api/telemetry/windows` - Get Windows telemetry data
- `GET /api/telemetry/linux` - Get Linux telemetry data
- `POST /api/telemetry/sync?platform=windows` - Sync Windows data from GitHub
- `POST /api/telemetry/sync?platform=linux` - Sync Linux data from GitHub

## Updating Data

### Manual Sync from GitHub

To sync data from GitHub after changes:



### Re-running Migration

If you need to completely re-migrate data:

```bash
npm run migrate-data
```

This will clear all existing data and re-import from GitHub.

## Troubleshooting

### Common Issues

1. **Migration fails**: Check that all environment variables are set correctly
2. **Database connection error**: Verify your DATABASE_URL and that PostgreSQL is running
3. **Permission denied**: Ensure you're using the SERVICE_ROLE_KEY for migrations
4. **API returns empty data**: Run the migration script to populate the database

### Checking Data

Connect to your database and run queries to verify data:

```sql
-- Check table counts
SELECT 
  (SELECT COUNT(*) FROM windows_telemetry) as windows_categories,
  (SELECT COUNT(*) FROM linux_telemetry) as linux_categories,
  (SELECT COUNT(*) FROM windows_table_results) as windows_table_results,
  (SELECT COUNT(*) FROM linux_table_results) as linux_table_results;

-- Check for any issues with relationships
SELECT wt.category, wt.subcategory, COUNT(ws.id) as score_count
FROM windows_telemetry wt
LEFT JOIN windows_table_results ws ON wt.id = ws.telemetry_id
GROUP BY wt.id, wt.category, wt.subcategory
HAVING COUNT(ws.id) = 0;
```

## Performance

The database includes indexes on commonly queried fields:
- Category and subcategory columns
- EDR name and status columns
- Foreign key relationships

For production use, consider:
- Enabling connection pooling
- Setting up read replicas for high traffic
- Implementing caching strategies
-- EDR Telemetry Database Schema
-- Run this script in your Supabase PostgreSQL database

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Windows Telemetry Categories Table
CREATE TABLE IF NOT EXISTS windows_telemetry (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(category, subcategory)
);

-- Linux Telemetry Categories Table
CREATE TABLE IF NOT EXISTS linux_telemetry (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(category, subcategory)
);

-- Windows Scores Table (EDR Implementation Status)
CREATE TABLE IF NOT EXISTS windows_table_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telemetry_id UUID NOT NULL REFERENCES windows_telemetry(id) ON DELETE CASCADE,
    edr_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Yes', 'No', 'Partially', 'Pending Response', 'Via EventLogs', 'Via EnablingTelemetry')),
    explanation TEXT, -- For "Partially" status explanations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(telemetry_id, edr_name)
);

-- Linux Scores Table (EDR Implementation Status)
CREATE TABLE IF NOT EXISTS linux_table_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    telemetry_id UUID NOT NULL REFERENCES linux_telemetry(id) ON DELETE CASCADE,
    edr_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Yes', 'No', 'Partially', 'Pending Response', 'Via EventLogs', 'Via EnablingTelemetry')),
    explanation TEXT, -- For "Partially" status explanations
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(telemetry_id, edr_name)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_windows_telemetry_category ON windows_telemetry(category);
CREATE INDEX IF NOT EXISTS idx_windows_telemetry_subcategory ON windows_telemetry(subcategory);
CREATE INDEX IF NOT EXISTS idx_linux_telemetry_category ON linux_telemetry(category);
CREATE INDEX IF NOT EXISTS idx_linux_telemetry_subcategory ON linux_telemetry(subcategory);

CREATE INDEX IF NOT EXISTS idx_windows_table_results_telemetry_id ON windows_table_results(telemetry_id);
CREATE INDEX IF NOT EXISTS idx_windows_table_results_edr_name ON windows_table_results(edr_name);
CREATE INDEX IF NOT EXISTS idx_windows_table_results_status ON windows_table_results(status);

CREATE INDEX IF NOT EXISTS idx_linux_table_results_telemetry_id ON linux_table_results(telemetry_id);
CREATE INDEX IF NOT EXISTS idx_linux_table_results_edr_name ON linux_table_results(edr_name);
CREATE INDEX IF NOT EXISTS idx_linux_table_results_status ON linux_table_results(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at column
CREATE OR REPLACE TRIGGER update_windows_telemetry_updated_at 
    BEFORE UPDATE ON windows_telemetry 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_linux_telemetry_updated_at 
    BEFORE UPDATE ON linux_telemetry 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_windows_table_results_updated_at 
    BEFORE UPDATE ON windows_table_results 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_linux_table_results_updated_at 
    BEFORE UPDATE ON linux_table_results 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional - can be enabled later if authentication is needed)
-- ALTER TABLE windows_telemetry ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE linux_telemetry ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE windows_table_results ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE linux_table_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (uncomment if RLS is enabled)
-- CREATE POLICY "Allow public read access" ON windows_telemetry FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON linux_telemetry FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON windows_table_results FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON linux_table_results FOR SELECT USING (true);

-- Newsletter Subscribers Table
-- Stores email addresses of users who subscribe to blog updates
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    confirmation_token TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for newsletter subscribers
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_is_active ON newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_token ON newsletter_subscribers(confirmation_token);

-- Create trigger to automatically update updated_at column for newsletter subscribers
CREATE OR REPLACE TRIGGER update_newsletter_subscribers_updated_at 
    BEFORE UPDATE ON newsletter_subscribers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security for newsletter subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- Rollback Migration: Remove optional field from telemetry tables
-- Description: This script reverts the addition of the optional field

-- Drop indexes first
DROP INDEX IF EXISTS idx_windows_telemetry_optional;
DROP INDEX IF EXISTS idx_linux_telemetry_optional;

-- Remove optional field from windows_telemetry table
ALTER TABLE windows_telemetry 
DROP COLUMN IF EXISTS optional;

-- Remove optional field from linux_telemetry table
ALTER TABLE linux_telemetry 
DROP COLUMN IF EXISTS optional;
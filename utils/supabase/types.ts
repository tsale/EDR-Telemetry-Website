export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      windows_telemetry: {
        Row: {
          id: string
          category: string
          subcategory: string
          optional: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          subcategory: string
          optional?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          subcategory?: string
          optional?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      linux_telemetry: {
        Row: {
          id: string
          category: string
          subcategory: string
          optional: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category: string
          subcategory: string
          optional?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string
          subcategory?: string
          optional?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      windows_table_results: {
        Row: {
          id: string
          telemetry_id: string
          edr_name: string
          status: string
          explanation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telemetry_id: string
          edr_name: string
          status: string
          explanation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telemetry_id?: string
          edr_name?: string
          status?: string
          explanation?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "windows_table_results_telemetry_id_fkey"
            columns: ["telemetry_id"]
            isOneToOne: false
            referencedRelation: "windows_telemetry"
            referencedColumns: ["id"]
          }
        ]
      }
      linux_table_results: {
        Row: {
          id: string
          telemetry_id: string
          edr_name: string
          status: string
          explanation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telemetry_id: string
          edr_name: string
          status: string
          explanation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telemetry_id?: string
          edr_name?: string
          status?: string
          explanation?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "linux_table_results_telemetry_id_fkey"
            columns: ["telemetry_id"]
            referencedRelation: "linux_telemetry"
            referencedColumns: ["id"]
          }
        ]
      }
      vendor_transparency: {
        Row: {
          id: string
          edr_name: string
          indicators: string[]
          transparency_note: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          edr_name: string
          indicators?: string[]
          transparency_note?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          edr_name?: string
          indicators?: string[]
          transparency_note?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type WindowsTelemetry = Database['public']['Tables']['windows_telemetry']['Row']
export type LinuxTelemetry = Database['public']['Tables']['linux_telemetry']['Row']
export type WindowsScore = Database['public']['Tables']['windows_table_results']['Row']
export type LinuxScore = Database['public']['Tables']['linux_table_results']['Row']

export type WindowsTelemetryInsert = Database['public']['Tables']['windows_telemetry']['Insert']
export type LinuxTelemetryInsert = Database['public']['Tables']['linux_telemetry']['Insert']
export type WindowsScoreInsert = Database['public']['Tables']['windows_table_results']['Insert']
export type LinuxScoreInsert = Database['public']['Tables']['linux_table_results']['Insert']
export type VendorTransparency = Database['public']['Tables']['vendor_transparency']['Row']

// Combined data types for easier frontend usage
export interface WindowsTelemetryWithScores extends WindowsTelemetry {
  windows_table_results: WindowsScore[]
}

export interface LinuxTelemetryWithScores extends LinuxTelemetry {
  linux_table_results: LinuxScore[]
}
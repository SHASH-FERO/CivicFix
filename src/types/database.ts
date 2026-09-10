export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_cases: {
        Row: {
          created_at: string
          department_id: string
          id: string
          issue_id: string
          official_notes: string | null
          status: Database["public"]["Enums"]["authority_case_status"]
          ticket_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          id?: string
          issue_id: string
          official_notes?: string | null
          status?: Database["public"]["Enums"]["authority_case_status"]
          ticket_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: string
          issue_id?: string
          official_notes?: string | null
          status?: Database["public"]["Enums"]["authority_case_status"]
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "authority_cases_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "authority_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "authority_cases_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: true
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      authority_departments: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      contributions: {
        Row: {
          amount: number
          contributor_id: string
          created_at: string
          id: string
          is_anonymous: boolean
          issue_id: string
          status: Database["public"]["Enums"]["contribution_status"]
          test_txn_ref: string | null
        }
        Insert: {
          amount: number
          contributor_id: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          issue_id: string
          status?: Database["public"]["Enums"]["contribution_status"]
          test_txn_ref?: string | null
        }
        Update: {
          amount?: number
          contributor_id?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          issue_id?: string
          status?: Database["public"]["Enums"]["contribution_status"]
          test_txn_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributions_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contributions_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issue_categories: {
        Row: {
          base_unit_rate: number
          created_at: string
          default_resolution_type: Database["public"]["Enums"]["resolution_type"]
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          base_unit_rate?: number
          created_at?: string
          default_resolution_type?: Database["public"]["Enums"]["resolution_type"]
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          base_unit_rate?: number
          created_at?: string
          default_resolution_type?: Database["public"]["Enums"]["resolution_type"]
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      issue_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          is_primary: boolean
          issue_id: string
          storage_path: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          issue_id: string
          storage_path: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          issue_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_images_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
        ]
      }
      issues: {
        Row: {
          address: string | null
          ai_confidence: number | null
          ai_summary: string | null
          ai_work_components: Json
          category_id: string | null
          created_at: string
          description: string
          duplicate_of_id: string | null
          embedding: string | null
          funding_raised: number
          funding_target: number
          id: string
          is_duplicate: boolean
          latitude: number | null
          location: unknown
          longitude: number | null
          reporter_id: string
          resolution_type: Database["public"]["Enums"]["resolution_type"] | null
          severity: Database["public"]["Enums"]["issue_severity"] | null
          status: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          ai_confidence?: number | null
          ai_summary?: string | null
          ai_work_components?: Json
          category_id?: string | null
          created_at?: string
          description: string
          duplicate_of_id?: string | null
          embedding?: string | null
          funding_raised?: number
          funding_target?: number
          id?: string
          is_duplicate?: boolean
          latitude?: number | null
          location: unknown
          longitude?: number | null
          reporter_id: string
          resolution_type?:
            | Database["public"]["Enums"]["resolution_type"]
            | null
          severity?: Database["public"]["Enums"]["issue_severity"] | null
          status?: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          ai_confidence?: number | null
          ai_summary?: string | null
          ai_work_components?: Json
          category_id?: string | null
          created_at?: string
          description?: string
          duplicate_of_id?: string | null
          embedding?: string | null
          funding_raised?: number
          funding_target?: number
          id?: string
          is_duplicate?: boolean
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          reporter_id?: string
          resolution_type?:
            | Database["public"]["Enums"]["resolution_type"]
            | null
          severity?: Database["public"]["Enums"]["issue_severity"] | null
          status?: Database["public"]["Enums"]["issue_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "issue_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_duplicate_of_id_fkey"
            columns: ["duplicate_of_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          issue_id: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          issue_id?: string | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          issue_id?: string | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      providers: {
        Row: {
          base_location: unknown
          business_name: string
          completed_repairs: number
          created_at: string
          id: string
          is_active: boolean
          is_verified: boolean
          rating: number
          service_radius_meters: number
          skills: string[]
        }
        Insert: {
          base_location?: unknown
          business_name: string
          completed_repairs?: number
          created_at?: string
          id: string
          is_active?: boolean
          is_verified?: boolean
          rating?: number
          service_radius_meters?: number
          skills?: string[]
        }
        Update: {
          base_location?: unknown
          business_name?: string
          completed_repairs?: number
          created_at?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          rating?: number
          service_radius_meters?: number
          skills?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "providers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      repairs: {
        Row: {
          accepted_at: string
          after_image_urls: string[]
          before_image_urls: string[]
          completion_notes: string | null
          created_at: string
          id: string
          issue_id: string
          provider_id: string
          quoted_amount: number
          simulated_payout: Database["public"]["Enums"]["simulated_payout_status"]
          status: Database["public"]["Enums"]["repair_status"]
          submitted_at: string | null
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          accepted_at?: string
          after_image_urls?: string[]
          before_image_urls?: string[]
          completion_notes?: string | null
          created_at?: string
          id?: string
          issue_id: string
          provider_id: string
          quoted_amount: number
          simulated_payout?: Database["public"]["Enums"]["simulated_payout_status"]
          status?: Database["public"]["Enums"]["repair_status"]
          submitted_at?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          accepted_at?: string
          after_image_urls?: string[]
          before_image_urls?: string[]
          completion_notes?: string | null
          created_at?: string
          id?: string
          issue_id?: string
          provider_id?: string
          quoted_amount?: number
          simulated_payout?: Database["public"]["Enums"]["simulated_payout_status"]
          status?: Database["public"]["Enums"]["repair_status"]
          submitted_at?: string | null
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repairs_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: true
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repairs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      verifications: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          repair_id: string
          verifier_id: string
          vote: Database["public"]["Enums"]["verification_vote"]
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          repair_id: string
          verifier_id: string
          vote: Database["public"]["Enums"]["verification_vote"]
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          repair_id?: string
          verifier_id?: string
          vote?: Database["public"]["Enums"]["verification_vote"]
        }
        Relationships: [
          {
            foreignKeyName: "verifications_repair_id_fkey"
            columns: ["repair_id"]
            isOneToOne: false
            referencedRelation: "repairs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verifications_verifier_id_fkey"
            columns: ["verifier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_duplicate_issues: {
        Args: {
          check_category_id: string
          check_lat: number
          check_lon: number
          proximity_meters?: number
        }
        Returns: {
          distance_meters: number
          existing_issue_id: string
          status: Database["public"]["Enums"]["issue_status"]
          title: string
        }[]
      }
      get_nearby_issues: {
        Args: { lat: number; lon: number; radius_meters?: number }
        Returns: {
          category_name: string
          description: string
          distance_meters: number
          funding_raised: number
          funding_target: number
          id: string
          latitude: number
          longitude: number
          status: Database["public"]["Enums"]["issue_status"]
          title: string
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      authority_case_status:
        | "FORWARDED"
        | "ACKNOWLEDGED"
        | "IN_PROGRESS"
        | "RESOLVED"
        | "REJECTED"
      contribution_status: "CONFIRMED" | "REFUNDED"
      issue_severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      issue_status:
        | "REPORTED"
        | "ANALYZING"
        | "ANALYZED"
        | "FUNDING"
        | "FUNDED"
        | "ASSIGNED"
        | "IN_PROGRESS"
        | "REPAIRED"
        | "VERIFYING"
        | "RESOLVED"
        | "CLOSED"
        | "REJECTED"
      notification_type:
        | "ISSUE_UPDATE"
        | "FUNDING_GOAL_MET"
        | "ASSIGNMENT_OFFER"
        | "REPAIR_SUBMITTED"
        | "VERIFICATION_REQUESTED"
        | "CASE_STATUS_CHANGE"
      repair_status:
        | "OFFERED"
        | "ACCEPTED"
        | "IN_PROGRESS"
        | "SUBMITTED"
        | "VERIFIED"
        | "REJECTED"
      resolution_type: "COMMUNITY_RESOLVABLE" | "AUTHORITY_REQUIRED"
      simulated_payout_status: "SIMULATED_PENDING" | "SIMULATED_PAID"
      user_role: "citizen" | "provider" | "authority" | "admin"
      verification_vote: "APPROVE" | "REJECT"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      authority_case_status: [
        "FORWARDED",
        "ACKNOWLEDGED",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
      ],
      contribution_status: ["CONFIRMED", "REFUNDED"],
      issue_severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      issue_status: [
        "REPORTED",
        "ANALYZING",
        "ANALYZED",
        "FUNDING",
        "FUNDED",
        "ASSIGNED",
        "IN_PROGRESS",
        "REPAIRED",
        "VERIFYING",
        "RESOLVED",
        "CLOSED",
        "REJECTED",
      ],
      notification_type: [
        "ISSUE_UPDATE",
        "FUNDING_GOAL_MET",
        "ASSIGNMENT_OFFER",
        "REPAIR_SUBMITTED",
        "VERIFICATION_REQUESTED",
        "CASE_STATUS_CHANGE",
      ],
      repair_status: [
        "OFFERED",
        "ACCEPTED",
        "IN_PROGRESS",
        "SUBMITTED",
        "VERIFIED",
        "REJECTED",
      ],
      resolution_type: ["COMMUNITY_RESOLVABLE", "AUTHORITY_REQUIRED"],
      simulated_payout_status: ["SIMULATED_PENDING", "SIMULATED_PAID"],
      user_role: ["citizen", "provider", "authority", "admin"],
      verification_vote: ["APPROVE", "REJECT"],
    },
  },
} as const

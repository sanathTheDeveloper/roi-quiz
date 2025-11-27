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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      lead_inputs: {
        Row: {
          after_hours_spend: number | null
          appointments: number | null
          avg_revenue: number | null
          billing_type: string | null
          call_vol_band: string | null
          clinic_band: string | null
          contract_type: string | null
          created_at: string
          dna_rate: number | null
          fte_band: string | null
          fte_replace_count: number | null
          hcp_band: string | null
          id: string
          lead_id: string
          routing_share: number | null
          unanswered_band: string | null
          wage_band: string | null
        }
        Insert: {
          after_hours_spend?: number | null
          appointments?: number | null
          avg_revenue?: number | null
          billing_type?: string | null
          call_vol_band?: string | null
          clinic_band?: string | null
          contract_type?: string | null
          created_at?: string
          dna_rate?: number | null
          fte_band?: string | null
          fte_replace_count?: number | null
          hcp_band?: string | null
          id?: string
          lead_id: string
          routing_share?: number | null
          unanswered_band?: string | null
          wage_band?: string | null
        }
        Update: {
          after_hours_spend?: number | null
          appointments?: number | null
          avg_revenue?: number | null
          billing_type?: string | null
          call_vol_band?: string | null
          clinic_band?: string | null
          contract_type?: string | null
          created_at?: string
          dna_rate?: number | null
          fte_band?: string | null
          fte_replace_count?: number | null
          hcp_band?: string | null
          id?: string
          lead_id?: string
          routing_share?: number | null
          unanswered_band?: string | null
          wage_band?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_inputs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["lead_id"]
          },
        ]
      }
      lead_metrics: {
        Row: {
          ai_interactions: number | null
          clinics_count_used: number | null
          created_at: string
          id: string
          lead_id: string
          monthly_ai_cost: number | null
          net_monthly_impact: number | null
          no_show_saved: number | null
          per_use_rate: number | null
          recovered_revenue: number | null
          staffing_saved: number | null
          subscription_fee: number | null
          total_annual_impact: number | null
          unanswered_midpoint: number | null
          year1_total_cost: number | null
        }
        Insert: {
          ai_interactions?: number | null
          clinics_count_used?: number | null
          created_at?: string
          id?: string
          lead_id: string
          monthly_ai_cost?: number | null
          net_monthly_impact?: number | null
          no_show_saved?: number | null
          per_use_rate?: number | null
          recovered_revenue?: number | null
          staffing_saved?: number | null
          subscription_fee?: number | null
          total_annual_impact?: number | null
          unanswered_midpoint?: number | null
          year1_total_cost?: number | null
        }
        Update: {
          ai_interactions?: number | null
          clinics_count_used?: number | null
          created_at?: string
          id?: string
          lead_id?: string
          monthly_ai_cost?: number | null
          net_monthly_impact?: number | null
          no_show_saved?: number | null
          per_use_rate?: number | null
          recovered_revenue?: number | null
          staffing_saved?: number | null
          subscription_fee?: number | null
          total_annual_impact?: number | null
          unanswered_midpoint?: number | null
          year1_total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_metrics_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["lead_id"]
          },
        ]
      }
      leads: {
        Row: {
          after_hours_spend: number | null
          ai_annual_cost: number | null
          ai_monthly_cost: number | null
          ai_routing_share: number | null
          annual_no_show_savings: number | null
          annual_revenue_recovered: number | null
          annual_staffing_saved: number | null
          appts_per_month: number | null
          avg_revenue_per_appt: number | null
          billing_model: string | null
          calculator_version: string | null
          call_volume_band: string | null
          city: string | null
          company: string | null
          consent_marketing: boolean
          consent_timestamp: string | null
          contract_type: string | null
          country: string | null
          created_at: string
          device: string | null
          dna_rate: number | null
          email: string
          first_name: string
          fte_reception_band: string | null
          fte_reduction: number | null
          hcp_band: string | null
          ip_address: string | null
          last_name: string | null
          lead_id: string
          monthly_no_show_savings: number | null
          monthly_revenue_recovered: number | null
          monthly_staffing_saved: number | null
          net_annual_savings: number | null
          net_monthly_savings: number | null
          notes: string | null
          num_clinics_band: string | null
          phone: string | null
          referrer: string | null
          role: string | null
          state: string | null
          sync_error: string | null
          sync_status: string | null
          timestamp_client: string | null
          total_annual_impact: number | null
          total_monthly_impact: number | null
          unanswered_band: string | null
          updated_at: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          wage_band: string | null
          website: string | null
        }
        Insert: {
          after_hours_spend?: number | null
          ai_annual_cost?: number | null
          ai_monthly_cost?: number | null
          ai_routing_share?: number | null
          annual_no_show_savings?: number | null
          annual_revenue_recovered?: number | null
          annual_staffing_saved?: number | null
          appts_per_month?: number | null
          avg_revenue_per_appt?: number | null
          billing_model?: string | null
          calculator_version?: string | null
          call_volume_band?: string | null
          city?: string | null
          company?: string | null
          consent_marketing?: boolean
          consent_timestamp?: string | null
          contract_type?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          dna_rate?: number | null
          email: string
          first_name: string
          fte_reception_band?: string | null
          fte_reduction?: number | null
          hcp_band?: string | null
          ip_address?: string | null
          last_name?: string | null
          lead_id?: string
          monthly_no_show_savings?: number | null
          monthly_revenue_recovered?: number | null
          monthly_staffing_saved?: number | null
          net_annual_savings?: number | null
          net_monthly_savings?: number | null
          notes?: string | null
          num_clinics_band?: string | null
          phone?: string | null
          referrer?: string | null
          role?: string | null
          state?: string | null
          sync_error?: string | null
          sync_status?: string | null
          timestamp_client?: string | null
          total_annual_impact?: number | null
          total_monthly_impact?: number | null
          unanswered_band?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wage_band?: string | null
          website?: string | null
        }
        Update: {
          after_hours_spend?: number | null
          ai_annual_cost?: number | null
          ai_monthly_cost?: number | null
          ai_routing_share?: number | null
          annual_no_show_savings?: number | null
          annual_revenue_recovered?: number | null
          annual_staffing_saved?: number | null
          appts_per_month?: number | null
          avg_revenue_per_appt?: number | null
          billing_model?: string | null
          calculator_version?: string | null
          call_volume_band?: string | null
          city?: string | null
          company?: string | null
          consent_marketing?: boolean
          consent_timestamp?: string | null
          contract_type?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          dna_rate?: number | null
          email?: string
          first_name?: string
          fte_reception_band?: string | null
          fte_reduction?: number | null
          hcp_band?: string | null
          ip_address?: string | null
          last_name?: string | null
          lead_id?: string
          monthly_no_show_savings?: number | null
          monthly_revenue_recovered?: number | null
          monthly_staffing_saved?: number | null
          net_annual_savings?: number | null
          net_monthly_savings?: number | null
          notes?: string | null
          num_clinics_band?: string | null
          phone?: string | null
          referrer?: string | null
          role?: string | null
          state?: string | null
          sync_error?: string | null
          sync_status?: string | null
          timestamp_client?: string | null
          total_annual_impact?: number | null
          total_monthly_impact?: number | null
          unanswered_band?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          wage_band?: string | null
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const

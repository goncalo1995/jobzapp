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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_credit_logs: {
        Row: {
          action_type: string
          amount: number
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action_type: string
          amount: number
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action_type?: string
          amount?: number
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          cost_estimate: number | null
          created_at: string | null
          id: string
          model: string
          platform: string
          roast_id: string | null
          tokens_input: number | null
          tokens_output: number | null
          user_id: string
        }
        Insert: {
          cost_estimate?: number | null
          created_at?: string | null
          id?: string
          model: string
          platform: string
          roast_id?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id: string
        }
        Update: {
          cost_estimate?: number | null
          created_at?: string | null
          id?: string
          model?: string
          platform?: string
          roast_id?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          industry: string | null
          is_public: boolean | null
          name: string
          notes: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean | null
          name: string
          notes?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          industry?: string | null
          is_public?: boolean | null
          name?: string
          notes?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          last_interaction: string | null
          linkedin: string | null
          name: string
          notes: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          last_interaction?: string | null
          linkedin?: string | null
          name: string
          notes?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          last_interaction?: string | null
          linkedin?: string | null
          name?: string
          notes?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cover_letters: {
        Row: {
          content: string
          created_at: string | null
          cv_id: string | null
          id: string
          job_application_id: string | null
          key_points: string[] | null
          pdf_url: string | null
          tone: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          cv_id?: string | null
          id?: string
          job_application_id?: string | null
          key_points?: string[] | null
          pdf_url?: string | null
          tone?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          cv_id?: string | null
          id?: string
          job_application_id?: string | null
          key_points?: string[] | null
          pdf_url?: string | null
          tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cover_letters_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cover_letters_job_application_id_fkey"
            columns: ["job_application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      cvs: {
        Row: {
          ats_keywords: string[] | null
          base_on_profile_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          markdown_content: string | null
          metadata: Json | null
          name: string
          pdf_url: string | null
          success_rate: number | null
          target_role: string | null
          updated_at: string | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          ats_keywords?: string[] | null
          base_on_profile_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          markdown_content?: string | null
          metadata?: Json | null
          name: string
          pdf_url?: string | null
          success_rate?: number | null
          target_role?: string | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          ats_keywords?: string[] | null
          base_on_profile_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          markdown_content?: string | null
          metadata?: Json | null
          name?: string
          pdf_url?: string | null
          success_rate?: number | null
          target_role?: string | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cvs_base_on_profile_id_fkey"
            columns: ["base_on_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          follow_up_completed: boolean | null
          follow_up_date: string | null
          id: string
          interaction_date: string | null
          job_application_id: string | null
          notes: string | null
          type: Database["public"]["Enums"]["interaction_type"]
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          follow_up_completed?: boolean | null
          follow_up_date?: string | null
          id?: string
          interaction_date?: string | null
          job_application_id?: string | null
          notes?: string | null
          type: Database["public"]["Enums"]["interaction_type"]
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          follow_up_completed?: boolean | null
          follow_up_date?: string | null
          id?: string
          interaction_date?: string | null
          job_application_id?: string | null
          notes?: string | null
          type?: Database["public"]["Enums"]["interaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_job_application_id_fkey"
            columns: ["job_application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          ai_prep_data: Json[] | null
          created_at: string | null
          duration: number | null
          feedback: string | null
          follow_up_date: string | null
          follow_up_sent: boolean | null
          format: string | null
          id: string
          interview_date: string | null
          interviewer_ids: string[] | null
          interviewer_names: string[] | null
          job_application_id: string | null
          next_steps: string | null
          notes: string | null
          preparation_notes: string | null
          questions_asked: string[] | null
          rating: number | null
          round: number | null
          star_stories: Json | null
          type: Database["public"]["Enums"]["interview_type"]
          your_questions: string[] | null
        }
        Insert: {
          ai_prep_data?: Json[] | null
          created_at?: string | null
          duration?: number | null
          feedback?: string | null
          follow_up_date?: string | null
          follow_up_sent?: boolean | null
          format?: string | null
          id?: string
          interview_date?: string | null
          interviewer_ids?: string[] | null
          interviewer_names?: string[] | null
          job_application_id?: string | null
          next_steps?: string | null
          notes?: string | null
          preparation_notes?: string | null
          questions_asked?: string[] | null
          rating?: number | null
          round?: number | null
          star_stories?: Json | null
          type: Database["public"]["Enums"]["interview_type"]
          your_questions?: string[] | null
        }
        Update: {
          ai_prep_data?: Json[] | null
          created_at?: string | null
          duration?: number | null
          feedback?: string | null
          follow_up_date?: string | null
          follow_up_sent?: boolean | null
          format?: string | null
          id?: string
          interview_date?: string | null
          interviewer_ids?: string[] | null
          interviewer_names?: string[] | null
          job_application_id?: string | null
          next_steps?: string | null
          notes?: string | null
          preparation_notes?: string | null
          questions_asked?: string[] | null
          rating?: number | null
          round?: number | null
          star_stories?: Json | null
          type?: Database["public"]["Enums"]["interview_type"]
          your_questions?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_job_application_id_fkey"
            columns: ["job_application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_date: string | null
          benefits: string[] | null
          company_id: string | null
          company_name_denormalized: string | null
          cover_letter_id: string | null
          cover_letter_snapshot: string | null
          created_at: string | null
          cv_id: string | null
          cv_snapshot: string | null
          flexibility: string | null
          id: string
          job_description: string | null
          job_url: string | null
          last_updated: string | null
          location: string | null
          match_score: number | null
          max_salary: number | null
          min_salary: number | null
          next_follow_up: string | null
          notes: string | null
          position: string
          response_time: number | null
          salary_currency: string | null
          source: string | null
          source_board: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          applied_date?: string | null
          benefits?: string[] | null
          company_id?: string | null
          company_name_denormalized?: string | null
          cover_letter_id?: string | null
          cover_letter_snapshot?: string | null
          created_at?: string | null
          cv_id?: string | null
          cv_snapshot?: string | null
          flexibility?: string | null
          id?: string
          job_description?: string | null
          job_url?: string | null
          last_updated?: string | null
          location?: string | null
          match_score?: number | null
          max_salary?: number | null
          min_salary?: number | null
          next_follow_up?: string | null
          notes?: string | null
          position: string
          response_time?: number | null
          salary_currency?: string | null
          source?: string | null
          source_board?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          applied_date?: string | null
          benefits?: string[] | null
          company_id?: string | null
          company_name_denormalized?: string | null
          cover_letter_id?: string | null
          cover_letter_snapshot?: string | null
          created_at?: string | null
          cv_id?: string | null
          cv_snapshot?: string | null
          flexibility?: string | null
          id?: string
          job_description?: string | null
          job_url?: string | null
          last_updated?: string | null
          location?: string | null
          match_score?: number | null
          max_salary?: number | null
          min_salary?: number | null
          next_follow_up?: string | null
          notes?: string | null
          position?: string
          response_time?: number | null
          salary_currency?: string | null
          source?: string | null
          source_board?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_cover_letter"
            columns: ["cover_letter_id"]
            isOneToOne: false
            referencedRelation: "cover_letters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_cv_id_fkey"
            columns: ["cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_offers: {
        Row: {
          base_salary: number | null
          base_salary_currency: string | null
          benefits: string[] | null
          bonus: string | null
          comparison_score: number | null
          cons: string[] | null
          counter_offer: string | null
          created_at: string | null
          decision_rationale: string | null
          equity: string | null
          expiry_date: string | null
          extended_date: string | null
          final_offer: string | null
          id: string
          initial_offer: string | null
          job_application_id: string | null
          negotiation_notes: string | null
          pros: string[] | null
          relocation_package: string | null
          remote_policy: string | null
          response_date: string | null
          signing_bonus: number | null
          status: Database["public"]["Enums"]["offer_status"] | null
          vacation_days: number | null
        }
        Insert: {
          base_salary?: number | null
          base_salary_currency?: string | null
          benefits?: string[] | null
          bonus?: string | null
          comparison_score?: number | null
          cons?: string[] | null
          counter_offer?: string | null
          created_at?: string | null
          decision_rationale?: string | null
          equity?: string | null
          expiry_date?: string | null
          extended_date?: string | null
          final_offer?: string | null
          id?: string
          initial_offer?: string | null
          job_application_id?: string | null
          negotiation_notes?: string | null
          pros?: string[] | null
          relocation_package?: string | null
          remote_policy?: string | null
          response_date?: string | null
          signing_bonus?: number | null
          status?: Database["public"]["Enums"]["offer_status"] | null
          vacation_days?: number | null
        }
        Update: {
          base_salary?: number | null
          base_salary_currency?: string | null
          benefits?: string[] | null
          bonus?: string | null
          comparison_score?: number | null
          cons?: string[] | null
          counter_offer?: string | null
          created_at?: string | null
          decision_rationale?: string | null
          equity?: string | null
          expiry_date?: string | null
          extended_date?: string | null
          final_offer?: string | null
          id?: string
          initial_offer?: string | null
          job_application_id?: string | null
          negotiation_notes?: string | null
          pros?: string[] | null
          relocation_package?: string | null
          remote_policy?: string | null
          response_date?: string | null
          signing_bonus?: number | null
          status?: Database["public"]["Enums"]["offer_status"] | null
          vacation_days?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_offers_job_application_id_fkey"
            columns: ["job_application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      processed_checkouts: {
        Row: {
          amount: number
          checkout_id: string
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          amount: number
          checkout_id: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          checkout_id?: string
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_ip_hash: string
          referrer_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_ip_hash: string
          referrer_id: string
          status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_ip_hash?: string
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          ai_credits: number
          created_at: string | null
          default_cv_id: string | null
          email: string | null
          id: string
          job_search_preferences: Json | null
          name: string | null
          parsed_data: Json | null
          raw_bio: string | null
          updated_at: string | null
        }
        Insert: {
          ai_credits?: number
          created_at?: string | null
          default_cv_id?: string | null
          email?: string | null
          id: string
          job_search_preferences?: Json | null
          name?: string | null
          parsed_data?: Json | null
          raw_bio?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_credits?: number
          created_at?: string | null
          default_cv_id?: string | null
          email?: string | null
          id?: string
          job_search_preferences?: Json | null
          name?: string | null
          parsed_data?: Json | null
          raw_bio?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_default_cv"
            columns: ["default_cv_id"]
            isOneToOne: false
            referencedRelation: "cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string | null
          email: string
          id: string
          tier: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          tier?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          tier?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deduct_ai_credits: {
        Args: { amount: number; target_user_id: string }
        Returns: boolean
      }
      handle_successful_checkout: {
        Args: { _checkout_id: string; _credit_amount: number; _user_id: string }
        Returns: undefined
      }
      increment_ai_credits: {
        Args: { amount: number; user_id: string }
        Returns: undefined
      }
      process_referral: {
        Args: {
          p_ip_hash: string
          p_referrer_id: string
          p_reward_amount: number
        }
        Returns: Json
      }
    }
    Enums: {
      application_status:
        | "Wishlist"
        | "Applied"
        | "Pending Review"
        | "Interviewing"
        | "Offer"
        | "Rejected"
        | "Withdrawn"
      interaction_type:
        | "Email"
        | "Call"
        | "LinkedIn"
        | "Interview"
        | "Follow-up"
      interview_type:
        | "Phone Screen"
        | "Technical"
        | "HR"
        | "Hiring Manager"
        | "Panel"
        | "Final"
        | "Take-home"
      offer_status:
        | "Pending"
        | "Accepted"
        | "Declined"
        | "Negotiating"
        | "Expired"
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
      application_status: [
        "Wishlist",
        "Applied",
        "Pending Review",
        "Interviewing",
        "Offer",
        "Rejected",
        "Withdrawn",
      ],
      interaction_type: ["Email", "Call", "LinkedIn", "Interview", "Follow-up"],
      interview_type: [
        "Phone Screen",
        "Technical",
        "HR",
        "Hiring Manager",
        "Panel",
        "Final",
        "Take-home",
      ],
      offer_status: [
        "Pending",
        "Accepted",
        "Declined",
        "Negotiating",
        "Expired",
      ],
    },
  },
} as const

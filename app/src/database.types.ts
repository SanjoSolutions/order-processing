export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          during: string
          id: number
        }
        Insert: {
          during: string
          id?: number
        }
        Update: {
          during?: string
          id?: number
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      company_admins: {
        Row: {
          company_id: number
          user_id: string
        }
        Insert: {
          company_id: number
          user_id: string
        }
        Update: {
          company_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_id: number
          created_at: string
          user_id: string
        }
        Insert: {
          company_id: number
          created_at?: string
          user_id: string
        }
        Update: {
          company_id?: number
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      opening_hours: {
        Row: {
          created_at: string
          friday_from: string | null
          friday_to: string | null
          monday_from: string | null
          monday_to: string | null
          permanent_establishment_id: number
          saturday_from: string | null
          saturday_to: string | null
          sunday_from: string | null
          sunday_to: string | null
          thursday_from: string | null
          thursday_to: string | null
          tuesday_from: string | null
          tuesday_to: string | null
          wednesday_from: string | null
          wednesday_to: string | null
        }
        Insert: {
          created_at?: string
          friday_from?: string | null
          friday_to?: string | null
          monday_from?: string | null
          monday_to?: string | null
          permanent_establishment_id: number
          saturday_from?: string | null
          saturday_to?: string | null
          sunday_from?: string | null
          sunday_to?: string | null
          thursday_from?: string | null
          thursday_to?: string | null
          tuesday_from?: string | null
          tuesday_to?: string | null
          wednesday_from?: string | null
          wednesday_to?: string | null
        }
        Update: {
          created_at?: string
          friday_from?: string | null
          friday_to?: string | null
          monday_from?: string | null
          monday_to?: string | null
          permanent_establishment_id?: number
          saturday_from?: string | null
          saturday_to?: string | null
          sunday_from?: string | null
          sunday_to?: string | null
          thursday_from?: string | null
          thursday_to?: string | null
          tuesday_from?: string | null
          tuesday_to?: string | null
          wednesday_from?: string | null
          wednesday_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_permanent_establishment_id"
            columns: ["permanent_establishment_id"]
            isOneToOne: true
            referencedRelation: "permanent_establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_establishment_employees: {
        Row: {
          permanent_establishment_id: number
          user_id: string
        }
        Insert: {
          permanent_establishment_id: number
          user_id: string
        }
        Update: {
          permanent_establishment_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permanent_establishment_employe_permanent_establishment_id_fkey"
            columns: ["permanent_establishment_id"]
            isOneToOne: false
            referencedRelation: "permanent_establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      permanent_establishments: {
        Row: {
          city: string | null
          company_id: number
          country: string | null
          id: number
          name: string
          street_and_house_number: string | null
          zip: string | null
        }
        Insert: {
          city?: string | null
          company_id: number
          country?: string | null
          id?: number
          name: string
          street_and_house_number?: string | null
          zip?: string | null
        }
        Update: {
          city?: string | null
          company_id?: number
          country?: string | null
          id?: number
          name?: string
          street_and_house_number?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permanent_establishments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      regular_working_hours: {
        Row: {
          day_of_week: number
          employee_id: string
          end_time: string
          id: number
          start_time: string
        }
        Insert: {
          day_of_week: number
          employee_id: string
          end_time: string
          id?: number
          start_time: string
        }
        Update: {
          day_of_week?: number
          employee_id?: string
          end_time?: string
          id?: number
          start_time?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          company_id: number | null
          created_at: string
          duration: string
          id: number
          name: string
          permanent_establishment_id: number | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string
          duration: string
          id?: number
          name: string
          permanent_establishment_id?: number | null
        }
        Update: {
          company_id?: number | null
          created_at?: string
          duration?: string
          id?: number
          name?: string
          permanent_establishment_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_permanent_establishment_id_fkey"
            columns: ["permanent_establishment_id"]
            isOneToOne: false
            referencedRelation: "permanent_establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      sick_leaves: {
        Row: {
          employee_id: string
          end_date: string
          id: number
          start_date: string
        }
        Insert: {
          employee_id: string
          end_date: string
          id?: number
          start_date: string
        }
        Update: {
          employee_id?: string
          end_date?: string
          id?: number
          start_date?: string
        }
        Relationships: []
      }
      vacation: {
        Row: {
          employee_id: string
          end_date: string
          id: number
          start_date: string
        }
        Insert: {
          employee_id: string
          end_date: string
          id?: number
          start_date: string
        }
        Update: {
          employee_id?: string
          end_date?: string
          id?: number
          start_date?: string
        }
        Relationships: []
      }
      working_times: {
        Row: {
          employee_id: string
          end_time: string
          id: number
          start_time: string
        }
        Insert: {
          employee_id: string
          end_time: string
          id?: number
          start_time: string
        }
        Update: {
          employee_id?: string
          end_time?: string
          id?: number
          start_time?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: {
          lookup_invitation_token: string
        }
        Returns: Json
      }
      companies_that_user_is_admin_of: {
        Args: Record<PropertyKey, never>
        Returns: {
          company_id: number
        }[]
      }
      create_account: {
        Args: {
          slug?: string
          name?: string
        }
        Returns: Json
      }
      create_company: {
        Args: {
          name: string
        }
        Returns: number
      }
      create_invitation: {
        Args: {
          account_id: string
          account_role: "owner" | "member"
          invitation_type: "one_time" | "24_hour"
        }
        Returns: Json
      }
      current_user_account_role: {
        Args: {
          account_id: string
        }
        Returns: Json
      }
      delete_invitation: {
        Args: {
          invitation_id: string
        }
        Returns: undefined
      }
      get_account: {
        Args: {
          account_id: string
        }
        Returns: Json
      }
      get_account_billing_status: {
        Args: {
          account_id: string
        }
        Returns: Json
      }
      get_account_by_slug: {
        Args: {
          slug: string
        }
        Returns: Json
      }
      get_account_id: {
        Args: {
          slug: string
        }
        Returns: string
      }
      get_account_invitations: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_account_members: {
        Args: {
          account_id: string
          results_limit?: number
          results_offset?: number
        }
        Returns: Json
      }
      get_accounts: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_personal_account: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      lookup_invitation: {
        Args: {
          lookup_invitation_token: string
        }
        Returns: Json
      }
      permanent_establishments_of_companies_that_user_is_admin_of: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
        }[]
      }
      remove_account_member: {
        Args: {
          account_id: string
          user_id: string
        }
        Returns: undefined
      }
      service_role_upsert_customer_subscription: {
        Args: {
          account_id: string
          customer?: Json
          subscription?: Json
        }
        Returns: undefined
      }
      update_account: {
        Args: {
          account_id: string
          slug?: string
          name?: string
          public_metadata?: Json
          replace_metadata?: boolean
        }
        Returns: Json
      }
      update_account_user_role: {
        Args: {
          account_id: string
          user_id: string
          new_account_role: "owner" | "member"
          make_primary_owner?: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never


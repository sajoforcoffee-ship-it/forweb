export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17";
  };
  public: {
    Tables: {
      articles: {
        Row: {
          baslik: string;
          category_id: string;
          created_at: string;
          icerik: string;
          id: string;
          ozet: string;
          sira: number;
          slug: string;
          updated_at: string;
          yayinda: boolean;
        };
        Insert: {
          baslik: string;
          category_id: string;
          created_at?: string;
          icerik?: string;
          id?: string;
          ozet?: string;
          sira?: number;
          slug: string;
          updated_at?: string;
          yayinda?: boolean;
        };
        Update: {
          baslik?: string;
          category_id?: string;
          created_at?: string;
          icerik?: string;
          id?: string;
          ozet?: string;
          sira?: number;
          slug?: string;
          updated_at?: string;
          yayinda?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      categories: {
        Row: {
          ad: string;
          created_at: string;
          giris: string;
          gorsel_anahtar: string;
          id: string;
          ozet: string;
          seviye: string;
          sira: number;
          slug: string;
          sure: string;
          updated_at: string;
          yayinda: boolean;
        };
        Insert: {
          ad: string;
          created_at?: string;
          giris?: string;
          gorsel_anahtar?: string;
          id?: string;
          ozet?: string;
          seviye?: string;
          sira?: number;
          slug: string;
          sure?: string;
          updated_at?: string;
          yayinda?: boolean;
        };
        Update: {
          ad?: string;
          created_at?: string;
          giris?: string;
          gorsel_anahtar?: string;
          id?: string;
          ozet?: string;
          seviye?: string;
          sira?: number;
          slug?: string;
          sure?: string;
          updated_at?: string;
          yayinda?: boolean;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      qr_codes: {
        Row: {
          aktif: boolean;
          created_at: string;
          etiket: string;
          hedef_slug: string | null;
          id: string;
          kod: string;
        };
        Insert: {
          aktif?: boolean;
          created_at?: string;
          etiket?: string;
          hedef_slug?: string | null;
          id?: string;
          kod: string;
        };
        Update: {
          aktif?: boolean;
          created_at?: string;
          etiket?: string;
          hedef_slug?: string | null;
          id?: string;
          kod?: string;
        };
        Relationships: [];
      };
      qr_scans: {
        Row: {
          cihaz: string | null;
          created_at: string;
          hedef_slug: string | null;
          id: string;
          isletim_sistemi: string | null;
          kod: string;
          referrer: string | null;
          sehir: string | null;
          tarayici: string | null;
          ulke: string | null;
        };
        Insert: {
          cihaz?: string | null;
          created_at?: string;
          hedef_slug?: string | null;
          id?: string;
          isletim_sistemi?: string | null;
          kod: string;
          referrer?: string | null;
          sehir?: string | null;
          tarayici?: string | null;
          ulke?: string | null;
        };
        Update: {
          cihaz?: string | null;
          created_at?: string;
          hedef_slug?: string | null;
          id?: string;
          isletim_sistemi?: string | null;
          kod?: string;
          referrer?: string | null;
          sehir?: string | null;
          tarayici?: string | null;
          ulke?: string | null;
        };
        Relationships: [];
      };
      search_queries: {
        Row: {
          created_at: string;
          id: string;
          sonuc_sayisi: number;
          sorgu: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          sonuc_sayisi?: number;
          sorgu: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          sonuc_sayisi?: number;
          sorgu?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_staff: { Args: { _user_id: string }; Returns: boolean };
    };
    Enums: {
      app_role: "admin" | "editor";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const;

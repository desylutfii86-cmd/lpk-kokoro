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
      artikel: {
        Row: {
          created_at: string
          deskripsi: string
          emoji: string | null
          gambar_tambahan: string[]
          id: string
          judul: string
          tanggal: string
          url_gambar: string | null
        }
        Insert: {
          created_at?: string
          deskripsi: string
          emoji?: string | null
          gambar_tambahan?: string[]
          id?: string
          judul: string
          tanggal?: string
          url_gambar?: string | null
        }
        Update: {
          created_at?: string
          deskripsi?: string
          emoji?: string | null
          gambar_tambahan?: string[]
          id?: string
          judul?: string
          tanggal?: string
          url_gambar?: string | null
        }
        Relationships: []
      }
      data_keberangkatan: {
        Row: {
          catatan: string | null
          created_at: string
          id: string
          nama_perusahaan: string
          nama_siswa: string
          status_ceo: string
          status_tiket: string
          status_visa: string
          tanggal_keberangkatan: string | null
          tanggal_pelepasan: string | null
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          id?: string
          nama_perusahaan: string
          nama_siswa: string
          status_ceo?: string
          status_tiket?: string
          status_visa?: string
          tanggal_keberangkatan?: string | null
          tanggal_pelepasan?: string | null
        }
        Update: {
          catatan?: string | null
          created_at?: string
          id?: string
          nama_perusahaan?: string
          nama_siswa?: string
          status_ceo?: string
          status_tiket?: string
          status_visa?: string
          tanggal_keberangkatan?: string | null
          tanggal_pelepasan?: string | null
        }
        Relationships: []
      }
      data_wawancara: {
        Row: {
          catatan: string | null
          created_at: string
          id: string
          nama_perusahaan: string
          nama_siswa: string
          tanggal_wawancara: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          id?: string
          nama_perusahaan: string
          nama_siswa: string
          tanggal_wawancara: string
        }
        Update: {
          catatan?: string | null
          created_at?: string
          id?: string
          nama_perusahaan?: string
          nama_siswa?: string
          tanggal_wawancara?: string
        }
        Relationships: []
      }
      galeri: {
        Row: {
          caption: string
          created_at: string
          emoji: string | null
          id: string
          url_gambar: string | null
        }
        Insert: {
          caption: string
          created_at?: string
          emoji?: string | null
          id?: string
          url_gambar?: string | null
        }
        Update: {
          caption?: string
          created_at?: string
          emoji?: string | null
          id?: string
          url_gambar?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string
          deskripsi: string
          emoji: string | null
          id: string
          judul: string
          url_gambar: string | null
        }
        Insert: {
          created_at?: string
          deskripsi: string
          emoji?: string | null
          id?: string
          judul: string
          url_gambar?: string | null
        }
        Update: {
          created_at?: string
          deskripsi?: string
          emoji?: string | null
          id?: string
          judul?: string
          url_gambar?: string | null
        }
        Relationships: []
      }
      pendaftaran: {
        Row: {
          created_at: string
          id: string
          nama: string
          no_hp: string
          program: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          nama: string
          no_hp: string
          program: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string
          no_hp?: string
          program?: string
          status?: string
        }
        Relationships: []
      }
      pesan: {
        Row: {
          created_at: string
          email: string
          id: string
          nama: string
          no_hp: string | null
          pesan: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nama: string
          no_hp?: string | null
          pesan: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nama?: string
          no_hp?: string | null
          pesan?: string
          status?: string
        }
        Relationships: []
      }
      program: {
        Row: {
          created_at: string
          deskripsi: string
          durasi: string
          id: string
          level: string
          nama: string
          url_gambar: string | null
          urutan: number
        }
        Insert: {
          created_at?: string
          deskripsi: string
          durasi: string
          id?: string
          level: string
          nama: string
          url_gambar?: string | null
          urutan?: number
        }
        Update: {
          created_at?: string
          deskripsi?: string
          durasi?: string
          id?: string
          level?: string
          nama?: string
          url_gambar?: string | null
          urutan?: number
        }
        Relationships: []
      }
      siswa_cv: {
        Row: {
          alamat: string
          appeal_kekurangan: string | null
          appeal_kelebihan: string | null
          created_at: string
          foto_url: string | null
          id: string
          jenis_kelamin: string
          keluarga_meninggal: Json
          keluarga_pisah_kk: Json
          keluarga_satu_kk: Json
          nama_lengkap: string
          no_hp: string
          pengalaman_kerja: Json
          status: string
          status_pernikahan: string
          tanggal_lahir: string
          tujuan_alasan: string | null
          tujuan_target: string | null
        }
        Insert: {
          alamat: string
          appeal_kekurangan?: string | null
          appeal_kelebihan?: string | null
          created_at?: string
          foto_url?: string | null
          id?: string
          jenis_kelamin: string
          keluarga_meninggal?: Json
          keluarga_pisah_kk?: Json
          keluarga_satu_kk?: Json
          nama_lengkap: string
          no_hp: string
          pengalaman_kerja?: Json
          status?: string
          status_pernikahan: string
          tanggal_lahir: string
          tujuan_alasan?: string | null
          tujuan_target?: string | null
        }
        Update: {
          alamat?: string
          appeal_kekurangan?: string | null
          appeal_kelebihan?: string | null
          created_at?: string
          foto_url?: string | null
          id?: string
          jenis_kelamin?: string
          keluarga_meninggal?: Json
          keluarga_pisah_kk?: Json
          keluarga_satu_kk?: Json
          nama_lengkap?: string
          no_hp?: string
          pengalaman_kerja?: Json
          status?: string
          status_pernikahan?: string
          tanggal_lahir?: string
          tujuan_alasan?: string | null
          tujuan_target?: string | null
        }
        Relationships: []
      }
      struktur_organisasi: {
        Row: {
          created_at: string
          deskripsi: string | null
          emoji: string | null
          id: string
          jabatan: string
          nama: string
          tipe: string
          url_gambar: string | null
          urutan: number
        }
        Insert: {
          created_at?: string
          deskripsi?: string | null
          emoji?: string | null
          id?: string
          jabatan: string
          nama: string
          tipe: string
          url_gambar?: string | null
          urutan?: number
        }
        Update: {
          created_at?: string
          deskripsi?: string | null
          emoji?: string | null
          id?: string
          jabatan?: string
          nama?: string
          tipe?: string
          url_gambar?: string | null
          urutan?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_admin_access: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "administrator"
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
      app_role: ["admin", "user", "administrator"],
    },
  },
} as const

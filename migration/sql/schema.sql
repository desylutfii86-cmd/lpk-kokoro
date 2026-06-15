-- ============================================================
-- Schema lengkap untuk migrasi ke Supabase baru
-- Jalankan di SQL Editor Supabase baru ATAU:
--   psql "$NEW_DB_URL" -f migration/sql/schema.sql
--
-- Gunakan file ini HANYA jika pg_dump tidak tersedia.
-- Jika pg_dump bisa dipakai, lebih baik pakai export-database.sh
-- (sudah include data sekaligus).
-- ============================================================

-- ===== Enum & Functions =====
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ===== Tables =====
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.artikel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  deskripsi text NOT NULL,
  tanggal date NOT NULL DEFAULT CURRENT_DATE,
  emoji text DEFAULT '📰',
  url_gambar text,
  gambar_tambahan text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.galeri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption text NOT NULL,
  emoji text DEFAULT '📷',
  url_gambar text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  deskripsi text NOT NULL,
  emoji text DEFAULT '💼',
  url_gambar text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  level text NOT NULL,
  durasi text NOT NULL,
  deskripsi text NOT NULL,
  url_gambar text,
  urutan int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.struktur_organisasi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  jabatan text NOT NULL,
  tipe text NOT NULL,
  emoji text DEFAULT '👤',
  deskripsi text,
  url_gambar text,
  urutan int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pendaftaran (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  no_hp text NOT NULL,
  program text NOT NULL,
  status text NOT NULL DEFAULT 'baru',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pesan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  email text NOT NULL,
  no_hp text,
  pesan text NOT NULL,
  status text NOT NULL DEFAULT 'baru',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===== RLS =====
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artikel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.struktur_organisasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pendaftaran ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesan ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Anyone can view articles" ON public.artikel FOR SELECT USING (true);
CREATE POLICY "Anyone can view gallery" ON public.galeri FOR SELECT USING (true);
CREATE POLICY "Anyone can view jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Anyone can view programs" ON public.program FOR SELECT USING (true);
CREATE POLICY "Anyone can view organization" ON public.struktur_organisasi FOR SELECT USING (true);

-- Admin manage
CREATE POLICY "Admins can manage articles" ON public.artikel FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage gallery" ON public.galeri FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage jobs" ON public.jobs FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage programs" ON public.program FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage organization" ON public.struktur_organisasi FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Pendaftaran
CREATE POLICY "Anyone can submit registration" ON public.pendaftaran FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all registrations" ON public.pendaftaran FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update registrations" ON public.pendaftaran FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete registrations" ON public.pendaftaran FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Pesan
CREATE POLICY "Anyone can submit message" ON public.pesan FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view messages" ON public.pesan FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update messages" ON public.pesan FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete messages" ON public.pesan FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- ===== Storage bucket =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read media" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
CREATE POLICY "Admin upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND has_role(auth.uid(), 'admin'));

-- ===== Buat admin pertama =====
-- Setelah signup user admin lewat aplikasi, jalankan:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('<paste-user-uuid-dari-auth.users>', 'admin');

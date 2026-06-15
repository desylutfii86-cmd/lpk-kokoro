
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Pendaftaran table
CREATE TABLE public.pendaftaran (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  no_hp TEXT NOT NULL,
  program TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'baru',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pendaftaran ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit registration"
  ON public.pendaftaran FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all registrations"
  ON public.pendaftaran FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update registrations"
  ON public.pendaftaran FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations"
  ON public.pendaftaran FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Program table
CREATE TABLE public.program (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  nama TEXT NOT NULL,
  durasi TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  urutan INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.program ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view programs"
  ON public.program FOR SELECT USING (true);

CREATE POLICY "Admins can manage programs"
  ON public.program FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  emoji TEXT DEFAULT '💼',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view jobs"
  ON public.jobs FOR SELECT USING (true);

CREATE POLICY "Admins can manage jobs"
  ON public.jobs FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Artikel table
CREATE TABLE public.artikel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  deskripsi TEXT NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  emoji TEXT DEFAULT '📰',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.artikel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view articles"
  ON public.artikel FOR SELECT USING (true);

CREATE POLICY "Admins can manage articles"
  ON public.artikel FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Galeri table
CREATE TABLE public.galeri (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT NOT NULL,
  emoji TEXT DEFAULT '📷',
  url_gambar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.galeri ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery"
  ON public.galeri FOR SELECT USING (true);

CREATE POLICY "Admins can manage gallery"
  ON public.galeri FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Struktur Organisasi table
CREATE TABLE public.struktur_organisasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  jabatan TEXT NOT NULL,
  tipe TEXT NOT NULL CHECK (tipe IN ('staff', 'pengajar')),
  emoji TEXT DEFAULT '👤',
  deskripsi TEXT,
  urutan INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.struktur_organisasi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view organization"
  ON public.struktur_organisasi FOR SELECT USING (true);

CREATE POLICY "Admins can manage organization"
  ON public.struktur_organisasi FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS for user_roles
CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));


CREATE TABLE public.siswa_cv (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foto_url TEXT,
  nama_lengkap TEXT NOT NULL,
  alamat TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin TEXT NOT NULL,
  status_pernikahan TEXT NOT NULL,
  no_hp TEXT NOT NULL,
  pengalaman_kerja JSONB NOT NULL DEFAULT '[]'::jsonb,
  keluarga_satu_kk JSONB NOT NULL DEFAULT '[]'::jsonb,
  keluarga_pisah_kk JSONB NOT NULL DEFAULT '[]'::jsonb,
  keluarga_meninggal JSONB NOT NULL DEFAULT '[]'::jsonb,
  tujuan_alasan TEXT,
  tujuan_target TEXT,
  appeal_kelebihan TEXT,
  appeal_kekurangan TEXT,
  status TEXT NOT NULL DEFAULT 'baru',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.siswa_cv TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.siswa_cv TO authenticated;
GRANT ALL ON public.siswa_cv TO service_role;

ALTER TABLE public.siswa_cv ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit CV"
  ON public.siswa_cv FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all CVs"
  ON public.siswa_cv FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update CVs"
  ON public.siswa_cv FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete CVs"
  ON public.siswa_cv FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

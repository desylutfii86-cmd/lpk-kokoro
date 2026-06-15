
CREATE TABLE public.data_wawancara (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_siswa text NOT NULL,
  tanggal_wawancara date NOT NULL,
  nama_perusahaan text NOT NULL,
  catatan text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_wawancara TO authenticated;
GRANT ALL ON public.data_wawancara TO service_role;
ALTER TABLE public.data_wawancara ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage wawancara" ON public.data_wawancara FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.data_keberangkatan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_siswa text NOT NULL,
  tanggal_pelepasan date,
  tanggal_keberangkatan date,
  nama_perusahaan text NOT NULL,
  status_visa text NOT NULL DEFAULT 'tidak',
  status_ceo text NOT NULL DEFAULT 'tidak',
  status_tiket text NOT NULL DEFAULT 'tidak',
  catatan text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_keberangkatan TO authenticated;
GRANT ALL ON public.data_keberangkatan TO service_role;
ALTER TABLE public.data_keberangkatan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage keberangkatan" ON public.data_keberangkatan FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


ALTER TABLE public.artikel ADD COLUMN IF NOT EXISTS url_gambar text;
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS url_gambar text;
ALTER TABLE public.struktur_organisasi ADD COLUMN IF NOT EXISTS url_gambar text;
ALTER TABLE public.program ADD COLUMN IF NOT EXISTS url_gambar text;

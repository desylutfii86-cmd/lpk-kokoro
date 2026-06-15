
-- Explicit admin-only mutations on user_roles
CREATE POLICY "Admins insert roles" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update roles" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete roles" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tighten public siswa-cv photo upload: image MIME types + 5 MB max
DROP POLICY IF EXISTS "Anyone can upload siswa-cv photos" ON storage.objects;
CREATE POLICY "Anyone can upload siswa-cv photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = 'siswa-cv'
  AND lower(coalesce((storage.extension(name)), '')) IN ('jpg','jpeg','png','webp','heic','heif')
  AND coalesce((metadata->>'size')::bigint, 0) <= 5242880
);

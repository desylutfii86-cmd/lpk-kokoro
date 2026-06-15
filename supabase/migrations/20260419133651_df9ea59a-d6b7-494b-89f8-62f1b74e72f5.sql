-- Create pesan (messages) table for contact form submissions
CREATE TABLE public.pesan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  no_hp TEXT,
  pesan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'baru',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pesan ENABLE ROW LEVEL SECURITY;

-- Anyone (public) can submit a message
CREATE POLICY "Anyone can submit message"
ON public.pesan
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view messages
CREATE POLICY "Admins can view messages"
ON public.pesan
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update messages (e.g., mark as read)
CREATE POLICY "Admins can update messages"
ON public.pesan
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete messages
CREATE POLICY "Admins can delete messages"
ON public.pesan
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.has_admin_access(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','administrator')
  )
$$;

-- Grant the existing user the administrator role (keep admin too)
INSERT INTO public.user_roles (user_id, role)
VALUES ('840eeb01-8476-4144-8fd9-0fd4c1e83854', 'administrator')
ON CONFLICT (user_id, role) DO NOTHING;

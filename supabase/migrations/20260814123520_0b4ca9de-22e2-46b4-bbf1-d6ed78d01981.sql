DROP POLICY IF EXISTS "Profiles are viewable" ON public.profiles;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.is_staff(auth.uid()));
REVOKE SELECT ON public.profiles FROM anon;
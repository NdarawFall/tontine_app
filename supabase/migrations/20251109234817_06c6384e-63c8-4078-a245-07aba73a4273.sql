-- Fix 1: Remove recursive RLS policy on tontine_members
DROP POLICY IF EXISTS "Users can view members of their tontines" ON public.tontine_members;

CREATE POLICY "Users can view members of their tontines"
ON public.tontine_members FOR SELECT
USING (
  -- Check via tontines table to avoid recursion
  EXISTS (
    SELECT 1 FROM public.tontines
    WHERE tontines.id = tontine_members.tontine_id
    AND (tontines.created_by = auth.uid() OR tontine_members.user_id = auth.uid())
  )
  OR has_role(auth.uid(), 'admin')
);

-- Fix 2: Add admin access to profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (
  auth.uid() = id 
  OR has_role(auth.uid(), 'admin')
);

-- Fix 3a: Update tontines SELECT policy to include admin check
DROP POLICY IF EXISTS "Users can view tontines they are members of" ON public.tontines;

CREATE POLICY "Users can view tontines they are members of"
ON public.tontines FOR SELECT
USING (
  auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM public.tontine_members
    WHERE tontine_members.tontine_id = tontines.id
    AND tontine_members.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
);

-- Fix 3b: Update transactions SELECT policy to include admin check
DROP POLICY IF EXISTS "Users can view transactions of their tontines" ON public.transactions;

CREATE POLICY "Users can view transactions of their tontines"
ON public.transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tontine_members
    WHERE tontine_members.tontine_id = transactions.tontine_id
    AND tontine_members.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
);
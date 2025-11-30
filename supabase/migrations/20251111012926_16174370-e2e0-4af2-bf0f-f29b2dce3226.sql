-- Create security definer function to check if user is tontine creator
CREATE OR REPLACE FUNCTION public.is_tontine_creator(_tontine_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.tontines
    WHERE id = _tontine_id
      AND created_by = _user_id
  )
$$;

-- Drop existing policy
DROP POLICY IF EXISTS "Tontine creators can add members" ON public.tontine_members;

-- Recreate policy using security definer function
CREATE POLICY "Tontine creators can add members" 
ON public.tontine_members 
FOR INSERT 
WITH CHECK (public.is_tontine_creator(tontine_id, auth.uid()));
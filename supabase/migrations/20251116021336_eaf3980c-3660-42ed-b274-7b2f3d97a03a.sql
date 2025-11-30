-- Fix function search path mutability issues
-- Recreate handle_new_user with SET search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, phone, full_name, email, id_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.phone, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'id_number', '')
  );
  RETURN NEW;
END;
$function$;

-- Recreate handle_updated_at with SET search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Add explicit immutability policies for transactions table
-- This ensures financial records cannot be modified or deleted
CREATE POLICY "Transactions are immutable - no updates"
ON public.transactions
FOR UPDATE
USING (false);

CREATE POLICY "Transactions are immutable - no deletions"
ON public.transactions
FOR DELETE
USING (false);
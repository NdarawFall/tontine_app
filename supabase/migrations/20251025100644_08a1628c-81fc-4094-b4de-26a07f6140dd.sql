-- Create tontines table
CREATE TABLE public.tontines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'bi-weekly', 'monthly')),
  max_members INTEGER NOT NULL DEFAULT 10,
  penalty_amount DECIMAL(10, 2) DEFAULT 0,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tontine_members table
CREATE TABLE public.tontine_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  turn_order INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'late')),
  has_received BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tontine_id, user_id),
  UNIQUE(tontine_id, turn_order)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tontine_id UUID NOT NULL REFERENCES public.tontines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'distribution', 'penalty')),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('orange', 'wave', 'yas')),
  phone_number TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tontines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tontine_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tontines
CREATE POLICY "Users can view tontines they are members of"
ON public.tontines FOR SELECT
USING (
  auth.uid() = created_by OR
  EXISTS (
    SELECT 1 FROM public.tontine_members
    WHERE tontine_members.tontine_id = tontines.id
    AND tontine_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own tontines"
ON public.tontines FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Tontine creators can update their tontines"
ON public.tontines FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Tontine creators can delete their tontines"
ON public.tontines FOR DELETE
USING (auth.uid() = created_by);

-- RLS Policies for tontine_members
CREATE POLICY "Users can view members of their tontines"
ON public.tontine_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tontine_members tm
    WHERE tm.tontine_id = tontine_members.tontine_id
    AND tm.user_id = auth.uid()
  )
);

CREATE POLICY "Tontine creators can add members"
ON public.tontine_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tontines
    WHERE tontines.id = tontine_members.tontine_id
    AND tontines.created_by = auth.uid()
  )
);

CREATE POLICY "Users can update their own membership"
ON public.tontine_members FOR UPDATE
USING (user_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users can view transactions of their tontines"
ON public.transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tontine_members
    WHERE tontine_members.tontine_id = transactions.tontine_id
    AND tontine_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create transactions for their tontines"
ON public.transactions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tontine_members
    WHERE tontine_members.tontine_id = transactions.tontine_id
    AND tontine_members.user_id = auth.uid()
  )
);

-- RLS Policies for payment_methods
CREATE POLICY "Users can view their own payment methods"
ON public.payment_methods FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payment methods"
ON public.payment_methods FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
ON public.payment_methods FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
ON public.payment_methods FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updating updated_at on tontines
CREATE TRIGGER update_tontines_updated_at
BEFORE UPDATE ON public.tontines
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_tontine_members_tontine_id ON public.tontine_members(tontine_id);
CREATE INDEX idx_tontine_members_user_id ON public.tontine_members(user_id);
CREATE INDEX idx_transactions_tontine_id ON public.transactions(tontine_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX idx_payment_methods_user_id ON public.payment_methods(user_id);
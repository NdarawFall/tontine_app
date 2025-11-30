import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Tontine {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  frequency: string;
  max_members: number;
  penalty_amount: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  total_saved?: number;
  next_turn_date?: string;
  progress?: number;
}

export const useTontines = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tontines, isLoading } = useQuery({
    queryKey: ["tontines"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tontines")
        .select(`
          *,
          tontine_members (
            id,
            user_id,
            payment_status,
            turn_order
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Calculate additional stats for each tontine
      const enrichedData = data.map((tontine: any) => {
        const memberCount = tontine.tontine_members?.length || 0;
        const paidMembers = tontine.tontine_members?.filter((m: any) => m.payment_status === "paid").length || 0;
        const progress = memberCount > 0 ? (paidMembers / memberCount) * 100 : 0;

        return {
          ...tontine,
          member_count: memberCount,
          progress: Math.round(progress)
        };
      });

      return enrichedData as Tontine[];
    },
  });

  const createTontine = useMutation({
    mutationFn: async (tontineData: {
      name: string;
      description?: string;
      amount: number;
      frequency: string;
      max_members: number;
      penalty_amount?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tontines")
        .insert([
          {
            ...tontineData,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from("tontine_members")
        .insert([
          {
            tontine_id: data.id,
            user_id: user.id,
            turn_order: 1,
            payment_status: "paid",
          },
        ]);

      if (memberError) throw memberError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tontines"] });
      toast({
        title: "Tontine créée",
        description: "Votre tontine a été créée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    tontines,
    isLoading,
    createTontine: createTontine.mutateAsync,
  };
};

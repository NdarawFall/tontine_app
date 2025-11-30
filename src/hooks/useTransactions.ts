import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  tontine_id: string;
  user_id: string;
  amount: number;
  type: "payment" | "distribution" | "penalty";
  status: "completed" | "pending" | "failed";
  description: string | null;
  created_at: string;
  tontine?: {
    name: string;
  };
}

export const useTransactions = (filter?: "payment" | "distribution") => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", filter],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from("transactions")
        .select(`
          *,
          tontines (
            name
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filter) {
        query = query.eq("type", filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((t: any) => ({
        ...t,
        tontine: t.tontines,
      })) as Transaction[];
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (transactionData: {
      tontine_id: string;
      amount: number;
      type: "payment" | "distribution" | "penalty";
      description?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            ...transactionData,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({
        title: "Transaction enregistrée",
        description: "La transaction a été enregistrée avec succès",
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

  const exportToCSV = () => {
    if (!transactions || transactions.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Il n'y a pas de transactions à exporter",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Date", "Tontine", "Type", "Montant", "Statut"];
    const rows = transactions.map((t) => [
      new Date(t.created_at).toLocaleDateString("fr-FR"),
      t.tontine?.name || "N/A",
      t.type === "payment" ? "Cotisation" : t.type === "distribution" ? "Distribution" : "Pénalité",
      `${t.amount} FCFA`,
      t.status === "completed" ? "Complété" : t.status === "pending" ? "En attente" : "Échoué",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: "Les transactions ont été exportées en CSV",
    });
  };

  return {
    transactions,
    isLoading,
    createTransaction: createTransaction.mutate,
    exportToCSV,
  };
};

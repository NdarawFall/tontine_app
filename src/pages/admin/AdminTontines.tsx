import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminBottomNav from "@/components/AdminBottomNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

const AdminTontines = () => {
  const { data: tontines, isLoading } = useQuery({
    queryKey: ["admin-tontines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tontines")
        .select(`
          *,
          profiles:created_by (full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Gestion des Tontines
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {tontines?.map((tontine) => (
              <Card key={tontine.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tontine.name}</CardTitle>
                    <Badge variant="secondary">{tontine.frequency}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {tontine.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>Montant: {tontine.amount} FCFA</span>
                    <span>Max: {tontine.max_members} membres</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Créé par: {tontine.profiles?.full_name || "N/A"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AdminBottomNav />
    </div>
  );
};

export default AdminTontines;

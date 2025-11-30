import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminBottomNav from "@/components/AdminBottomNav";

const AdminStats = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Statistiques
          </h1>
          <p className="text-muted-foreground">
            Statistiques détaillées de la plateforme
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Graphiques et Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Les graphiques et analyses détaillées seront affichés ici.
            </p>
          </CardContent>
        </Card>
      </div>

      <AdminBottomNav />
    </div>
  );
};

export default AdminStats;

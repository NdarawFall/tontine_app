import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminBottomNav from "@/components/AdminBottomNav";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminUsers = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Gestion des Utilisateurs
        </h1>

        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <div className="space-y-4">
            {users?.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback>
                        {user.full_name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{user.full_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    {user.email && <p>Email: {user.email}</p>}
                    {user.id_number && <p>ID: {user.id_number}</p>}
                  </div>
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

export default AdminUsers;

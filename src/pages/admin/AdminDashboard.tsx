import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminBottomNav from "@/components/AdminBottomNav";
import { Users, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [tontinesRes, usersRes, transactionsRes] = await Promise.all([
        supabase.from("tontines").select("*", { count: "exact" }),
        supabase.from("profiles").select("*", { count: "exact" }),
        supabase.from("transactions").select("amount"),
      ]);

      const totalAmount = transactionsRes.data?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        totalTontines: tontinesRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalTransactions: transactionsRes.data?.length || 0,
        totalAmount,
      };
    },
  });

  const statCards = [
    {
      title: "Total Utilisateurs",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Tontines",
      value: stats?.totalTontines || 0,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Total Transactions",
      value: stats?.totalTransactions || 0,
      icon: DollarSign,
      color: "text-yellow-500",
    },
    {
      title: "Montant Total",
      value: `${stats?.totalAmount || 0} FCFA`,
      icon: AlertCircle,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-gradient-hero px-6 pt-12 pb-20 rounded-[2rem] shadow-xl mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/80 text-sm">Vue d'ensemble de la plateforme</p>
        </div>

        <div className="grid grid-cols-2 gap-4 -mt-12">
          {statCards.map((stat, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`w-10 h-10 rounded-xl ${stat.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AdminBottomNav />
    </div>
  );
};

export default AdminDashboard;

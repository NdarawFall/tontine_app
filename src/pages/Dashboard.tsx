import { Card } from "@/components/ui/card";
import { Plus, Users, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTontines } from "@/hooks/useTontines";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserRole } from "@/hooks/useUserRole";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { tontines, isLoading } = useTontines();
  const { data: roleData, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      setProfile(profileData);
      setIsLoadingProfile(false);
    };

    loadUserData();
  }, [navigate]);

  useEffect(() => {
    if (!roleLoading && roleData?.isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [roleData?.isAdmin, roleLoading, navigate]);

  if (isLoadingProfile || !user) {
    return null;
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Utilisateur';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const activeTontines = tontines?.filter(t => t.member_count && t.member_count >= 2) || [];
  const totalSaved = tontines?.reduce((sum, t) => sum + (t.amount * (t.member_count || 0)), 0) || 0;

  const stats = [
    { label: "Total épargné", value: `${totalSaved.toLocaleString()} FCFA`, icon: TrendingUp, color: "text-success" },
    { label: "Tontines actives", value: activeTontines.length.toString(), icon: Users, color: "text-primary" },
    { label: "Prochain tour", value: "5 jours", icon: Clock, color: "text-warning" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-hero px-6 pt-12 pb-20 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Bonjour {displayName} 👋</h1>
            <p className="text-white/80">Bienvenue sur votre tableau de bord</p>
          </div>
          <Avatar 
            className="w-20 h-20 border-3 border-white/30 bg-white/10 transition-all hover:scale-110 hover:border-white/50 cursor-pointer shadow-xl"
            onClick={() => navigate("/profile")}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={displayName} className="object-cover w-full h-full" />
            ) : (
              <AvatarFallback className="bg-primary/20 text-white text-2xl font-bold">{initials}</AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="p-4 bg-white/10 backdrop-blur-md border-white/20 text-center transition-all hover:scale-105 hover:bg-white/15 animate-fade-in shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <p className="text-white/80 text-xs mb-1">{stat.label}</p>
                <p className="text-white font-bold text-sm">{stat.value}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-8">
        {/* Quick Action */}
        <Card 
          className="p-5 bg-gradient-primary shadow-primary cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all mb-6 animate-fade-in group"
          onClick={() => navigate("/create-tontine")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Créer une tontine</h3>
                <p className="text-white/80 text-sm">Démarrez un nouveau groupe</p>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>

        {/* My Tontines */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Mes Tontines
          </h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-24 w-full" />
                </Card>
              ))}
            </div>
          ) : tontines && tontines.length > 0 ? (
            <div className="space-y-4">
              {tontines.map((tontine, index) => (
                <Card 
                  key={tontine.id}
                  className="p-5 cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all animate-fade-in group"
                  onClick={() => navigate(`/tontine/${tontine.id}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                        {tontine.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {tontine.member_count || 0} membres
                        </span>
                        <span className="font-semibold text-primary">
                          {tontine.amount.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      (tontine.member_count || 0) >= 2
                        ? "bg-success/10 text-success" 
                        : "bg-warning/10 text-warning"
                    }`}>
                      {(tontine.member_count || 0) >= 2 ? "Actif" : "En attente"}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {tontine.frequency === 'weekly' ? 'Hebdomadaire' : tontine.frequency === 'bi-weekly' ? 'Bimensuel' : 'Mensuel'}
                      </span>
                      <span className="font-medium text-foreground">{tontine.progress || 0}% payé</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${tontine.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center bg-gradient-card">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">Aucune tontine pour le moment</p>
              <p className="text-sm text-muted-foreground">Créez votre première tontine pour commencer</p>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;

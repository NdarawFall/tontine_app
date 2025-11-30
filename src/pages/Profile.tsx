import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, User, Mail, CreditCard, Shield, Bell, HelpCircle, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ tontines: 0, total: 0, payments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      setUser(user);

      // Charger le profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Charger les stats
      const { data: tontines } = await supabase
        .from('tontines')
        .select('*')
        .or(`created_by.eq.${user.id},id.in.(select tontine_id from tontine_members where user_id='${user.id}')`);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id);

      setStats({
        tontines: tontines?.length || 0,
        total: transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0,
        payments: transactions?.length || 0,
      });

      setLoading(false);
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      });
    } else {
      navigate("/login");
    }
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  
  const menuSections = [
    {
      title: "Mon Compte",
      items: [
        { icon: User, label: "Informations personnelles", path: "/edit-profile" },
        { icon: Mail, label: "Email", value: user?.email || "Non renseigné" },
        { icon: CreditCard, label: "Méthodes de paiement", path: "/payment-methods" },
      ]
    },
    {
      title: "Paramètres",
      items: [
        { icon: Bell, label: "Notifications", path: "/notifications" },
        { icon: Shield, label: "Sécurité et confidentialité", path: "/security" },
        { icon: HelpCircle, label: "Aide et support", path: "/help" },
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="bg-gradient-hero px-6 pt-12 pb-20 rounded-b-3xl">
          <Skeleton className="h-8 w-32 mb-8 bg-white/20" />
          <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-20 h-20 rounded-full bg-white/20" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-32 bg-white/20" />
                <Skeleton className="h-4 w-24 bg-white/20" />
              </div>
            </div>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-hero px-6 pt-12 pb-20 rounded-b-[2rem] shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-8 animate-fade-in">Mon Profil</h1>
        
        {/* User Card */}
        <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-3 border-white/30 bg-white/10 shadow-lg">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-primary/20 text-white text-2xl">{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">{displayName}</h2>
              <p className="text-white/80 text-sm">
                Membre depuis {new Date(user?.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats.tontines}</p>
              <p className="text-white/80 text-xs">Tontines</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats.total.toLocaleString()}</p>
              <p className="text-white/80 text-xs">Total FCFA</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{stats.payments}</p>
              <p className="text-white/80 text-xs">Paiements</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Menu Sections */}
      <div className="px-6 -mt-8 space-y-6">
        {menuSections.map((section, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.2 + (index * 0.1)}s` }}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full"></span>
              {section.title}
            </h3>
            <Card className="overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={() => item.path && navigate(item.path)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-all border-b last:border-b-0 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                        {item.value && (
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                    {item.path && <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />}
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        {/* Logout */}
        <Button 
          variant="destructive" 
          size="lg" 
          className="w-full h-12 rounded-xl shadow-md"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Se déconnecter
        </Button>

        {/* Version */}
        <p className="text-center text-sm text-muted-foreground pb-4">
          Version 1.0.0
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;

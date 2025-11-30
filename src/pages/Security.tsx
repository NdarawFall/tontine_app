import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Lock, Fingerprint, Smartphone, Eye, Shield } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Security = () => {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    biometric: true,
    twoFactor: false,
    notifications: true,
    autoLock: true
  });

  const securityOptions = [
    {
      id: "biometric",
      icon: Fingerprint,
      title: "Authentification biométrique",
      description: "Utilisez votre empreinte digitale ou Face ID",
      enabled: settings.biometric
    },
    {
      id: "twoFactor",
      icon: Smartphone,
      title: "Authentification à deux facteurs",
      description: "Sécurisez votre compte avec un code SMS",
      enabled: settings.twoFactor
    },
    {
      id: "notifications",
      icon: Shield,
      title: "Alertes de sécurité",
      description: "Recevez des notifications pour les activités suspectes",
      enabled: settings.notifications
    },
    {
      id: "autoLock",
      icon: Lock,
      title: "Verrouillage automatique",
      description: "Verrouillez l'app après 5 minutes d'inactivité",
      enabled: settings.autoLock
    }
  ];

  const handleToggle = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-secondary px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Sécurité</h1>
        </div>
        <p className="text-white/80 text-sm">Protégez votre compte et vos données</p>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 space-y-6">
        {/* Security Options */}
        <Card className="divide-y">
          {securityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <Switch 
                  checked={option.enabled}
                  onCheckedChange={() => handleToggle(option.id)}
                />
              </div>
            );
          })}
        </Card>

        {/* Password Section */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Mot de passe</h3>
              <p className="text-sm text-muted-foreground">Dernière modification il y a 30 jours</p>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            Changer le mot de passe
          </Button>
        </Card>

        {/* Privacy Section */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Confidentialité</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Télécharger mes données
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive border-destructive/50 hover:bg-destructive/10">
              Supprimer mon compte
            </Button>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Security;

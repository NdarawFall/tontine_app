import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Book, Mail, Phone, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const Help = () => {
  const navigate = useNavigate();

  const helpCategories = [
    {
      icon: Book,
      title: "Comment ça marche ?",
      description: "Guide d'utilisation de l'application",
      action: () => {}
    },
    {
      icon: MessageCircle,
      title: "Questions fréquentes",
      description: "Trouvez des réponses rapides",
      action: () => {}
    }
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "+221 33 XXX XX XX",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@tontine.sn",
      description: "Réponse sous 24h"
    },
    {
      icon: MessageCircle,
      title: "Chat en direct",
      value: "Disponible maintenant",
      description: "Assistance immédiate"
    }
  ];

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
          <h1 className="text-2xl font-bold text-white">Aide & Support</h1>
        </div>
        <p className="text-white/80 text-sm">Nous sommes là pour vous aider</p>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 space-y-6">
        {/* Help Categories */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
            Centre d'aide
          </h2>
          <Card className="divide-y">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  onClick={category.action}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
              );
            })}
          </Card>
        </div>

        {/* Contact Options */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-2">
            Nous contacter
          </h2>
          <Card className="divide-y">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{option.title}</h3>
                      <p className="text-sm font-semibold text-primary mb-1">{option.value}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Contacter
                  </Button>
                </div>
              );
            })}
          </Card>
        </div>

        {/* App Info */}
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">Version de l'application</p>
          <p className="font-semibold text-foreground">1.0.0</p>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Help;

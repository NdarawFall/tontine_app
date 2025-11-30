import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash2, CheckCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AddPaymentMethodDialog from "@/components/AddPaymentMethodDialog";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { Skeleton } from "@/components/ui/skeleton";
import orangeMoneyLogo from "@/assets/orange-money.png";
import waveLogo from "@/assets/wave.png";
import yasLogo from "@/assets/yas.png";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { paymentMethods, isLoading, deletePaymentMethod, setDefaultPaymentMethod } = usePaymentMethods();

  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case "orange": return orangeMoneyLogo;
      case "wave": return waveLogo;
      case "yas": return yasLogo;
      default: return orangeMoneyLogo;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "orange": return "Orange Money";
      case "wave": return "Wave";
      case "yas": return "Yas";
      default: return provider;
    }
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
          <h1 className="text-2xl font-bold text-white">Méthodes de paiement</h1>
        </div>
        <p className="text-white/80 text-sm">Gérez vos moyens de paiement</p>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4 space-y-4">
        {/* Add New Payment Method */}
        <Card 
          className="p-4 bg-primary cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Ajouter une méthode</h3>
              <p className="text-white/80 text-sm">Orange Money, Wave ou Yas</p>
            </div>
          </div>
        </Card>

        {/* Payment Methods List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-16 w-full" />
                </Card>
              ))}
            </div>
          ) : paymentMethods && paymentMethods.length > 0 ? (
            paymentMethods.map((method) => {
              return (
                <Card key={method.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center p-2">
                        <img src={getProviderLogo(method.provider)} alt={method.provider} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{getProviderName(method.provider)}</h3>
                          {method.is_default && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-xs font-medium">
                              <CheckCircle className="h-3 w-3" />
                              Par défaut
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.phone_number}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deletePaymentMethod(method.id)}
                      className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5 text-destructive" />
                    </button>
                  </div>
                  
                  {!method.is_default && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => setDefaultPaymentMethod(method.id)}
                    >
                      Définir par défaut
                    </Button>
                  )}
                </Card>
              );
            })
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Aucune méthode de paiement</p>
              <p className="text-sm text-muted-foreground mt-2">Ajoutez votre première méthode pour commencer</p>
            </Card>
          )}
        </div>
      </div>

      <AddPaymentMethodDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />

      <BottomNav />
    </div>
  );
};

export default PaymentMethods;

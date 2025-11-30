import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import orangeMoneyLogo from "@/assets/orange-money.png";
import waveLogo from "@/assets/wave.png";
import yasLogo from "@/assets/yas.png";

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentProviders = [
  { id: "orange", name: "Orange Money", logo: orangeMoneyLogo },
  { id: "wave", name: "Wave", logo: waveLogo },
  { id: "yas", name: "Yas", logo: yasLogo },
];

const AddPaymentMethodDialog = ({ open, onOpenChange }: AddPaymentMethodDialogProps) => {
  const { addPaymentMethod } = usePaymentMethods();
  const [selectedProvider, setSelectedProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addPaymentMethod({
      provider: selectedProvider as "orange" | "wave" | "yas",
      phone_number: phoneNumber,
      is_default: false,
    });

    onOpenChange(false);
    setSelectedProvider("");
    setPhoneNumber("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une méthode de paiement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Choisissez votre opérateur</Label>
            <RadioGroup value={selectedProvider} onValueChange={setSelectedProvider}>
              {paymentProviders.map((provider) => (
                <div key={provider.id} className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={provider.id} id={provider.id} />
                  <Label htmlFor={provider.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                    <img 
                      src={provider.logo} 
                      alt={provider.name} 
                      className="w-12 h-12 object-contain rounded"
                    />
                    <span className="font-medium">{provider.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+221 77 XXX XX XX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!selectedProvider || !phoneNumber}
            >
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodDialog;

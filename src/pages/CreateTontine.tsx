import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Users, Coins, AlertCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useTontines } from "@/hooks/useTontines";

const tontineSchema = z.object({
  name: z.string().trim().min(3, "Le nom doit contenir au moins 3 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  description: z.string().max(500, "La description ne peut pas dépasser 500 caractères").optional(),
  amount: z.coerce.number()
    .positive("Le montant doit être positif")
    .min(100, "Le montant minimum est de 100 FCFA")
    .max(10000000, "Le montant ne peut pas dépasser 10,000,000 FCFA"),
  frequency: z.enum(["weekly", "biweekly", "monthly"], {
    errorMap: () => ({ message: "Veuillez sélectionner une fréquence" })
  }),
  maxMembers: z.coerce.number()
    .int("Le nombre de membres doit être un nombre entier")
    .min(2, "Il faut au minimum 2 membres")
    .max(100, "Le nombre maximum de membres est de 100"),
  penaltyAmount: z.coerce.number()
    .min(0, "Le montant de pénalité ne peut pas être négatif")
    .max(1000000, "Le montant de pénalité ne peut pas dépasser 1,000,000 FCFA")
    .optional()
    .default(0)
});

type TontineFormData = z.infer<typeof tontineSchema>;

const CreateTontine = () => {
  const navigate = useNavigate();
  const { createTontine } = useTontines();
  
  const form = useForm<TontineFormData>({
    resolver: zodResolver(tontineSchema),
    defaultValues: {
      name: "",
      description: "",
      amount: 0,
      frequency: undefined,
      maxMembers: 10,
      penaltyAmount: 0
    }
  });

  const onSubmit = async (data: TontineFormData) => {
    try {
      await createTontine({
        name: data.name,
        description: data.description || undefined,
        amount: data.amount,
        frequency: data.frequency,
        max_members: data.maxMembers,
        penalty_amount: data.penaltyAmount || 0,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-secondary px-6 pt-8 pb-6 sticky top-0 z-10">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-white/80 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-white">Créer une Tontine</h1>
        <p className="text-white/80 text-sm">Configurez votre nouveau groupe d'épargne</p>
      </div>

      {/* Form */}
      <div className="px-6 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="font-semibold text-foreground text-lg">Informations générales</h2>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la tontine *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Famille Diallo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Objectif du groupe, règles spécifiques..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum de membres *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Financial Settings */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Coins className="h-5 w-5 text-success" />
              </div>
              <h2 className="font-semibold text-foreground text-lg">Configuration financière</h2>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de la cotisation (FCFA) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 25000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fréquence de cotisation *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la fréquence" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="daily">Chaque jour</SelectItem>
                        <SelectItem value="2days">Tous les 2 jours</SelectItem>
                        <SelectItem value="3days">Tous les 3 jours</SelectItem>
                        <SelectItem value="weekly">Une semaine</SelectItem>
                        <SelectItem value="biweekly">15 jours</SelectItem>
                        <SelectItem value="monthly">Un mois</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Penalty Settings */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <h2 className="font-semibold text-foreground text-lg">Pénalités</h2>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="penaltyAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant de la pénalité (FCFA)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Pénalité appliquée en cas de retard de paiement
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="space-y-3">
            <Button type="submit" size="lg" className="w-full">
              Créer la tontine
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Annuler
            </Button>
          </div>
          </form>
        </Form>
      </div>

      <BottomNav />
    </div>
  );
};

export default CreateTontine;

import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, Users, TrendingUp, Calendar, Share2, Settings, CheckCircle, Clock, XCircle } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const TontineDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const members = [
    { id: 1, name: "Aminata Diallo", status: "paid", turn: 1, avatar: "👩🏿" },
    { id: 2, name: "Moussa Sy", status: "paid", turn: 2, avatar: "👨🏿" },
    { id: 3, name: "Fatou Sall", status: "pending", turn: 3, avatar: "👩🏿‍🦱" },
    { id: 4, name: "Cheikh Ba", status: "paid", turn: 4, avatar: "👨🏿‍🦲" },
    { id: 5, name: "Aissatou Kane", status: "late", turn: 5, avatar: "👩🏿" },
    { id: 6, name: "Ibrahima Fall", status: "paid", turn: 6, avatar: "👨🏿" },
  ];

  const transactions = [
    { id: 1, member: "Aminata Diallo", amount: "25,000 FCFA", date: "10 Jan 2025", type: "payment" },
    { id: 2, member: "Moussa Sy", amount: "25,000 FCFA", date: "10 Jan 2025", type: "payment" },
    { id: 3, member: "Cheikh Ba", amount: "25,000 FCFA", date: "11 Jan 2025", type: "payment" },
    { id: 4, member: "Aminata Diallo", amount: "150,000 FCFA", date: "12 Jan 2025", type: "distribution" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-hero px-6 pt-8 pb-6 rounded-b-[2rem] shadow-xl">
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-white/90 hover:text-white transition-all mb-4 hover:-translate-x-1 group"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:animate-pulse" />
          Retour
        </button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">Famille Diallo</h1>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Users className="h-4 w-4" />
                6 membres
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                <Calendar className="h-4 w-4" />
                Mensuelle
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-lg">
              <Share2 className="h-5 w-5 text-white" />
            </button>
            <button className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-lg">
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <p className="text-white/80 text-sm mb-1">Cotisation</p>
            <p className="text-white font-bold text-xl">25,000 FCFA</p>
          </Card>
          <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
            <p className="text-white/80 text-sm mb-1">Cagnotte totale</p>
            <p className="text-white font-bold text-xl">150,000 FCFA</p>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted p-1 h-12">
            <TabsTrigger value="members" className="rounded-xl">Membres</TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl">Historique</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-3">
            {members.map((member, index) => (
              <Card key={member.id} className="p-4 animate-fade-in hover:scale-[1.01] transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-2xl shadow-primary">
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">Tour #{member.turn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.status === "paid" && (
                      <span className="flex items-center gap-1.5 text-success text-sm bg-success/10 px-3 py-1.5 rounded-full font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Payé
                      </span>
                    )}
                    {member.status === "pending" && (
                      <span className="flex items-center gap-1.5 text-warning text-sm bg-warning/10 px-3 py-1.5 rounded-full font-medium">
                        <Clock className="h-4 w-4" />
                        En attente
                      </span>
                    )}
                    {member.status === "late" && (
                      <span className="flex items-center gap-1.5 text-destructive text-sm bg-destructive/10 px-3 py-1.5 rounded-full font-medium">
                        <XCircle className="h-4 w-4" />
                        Retard
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <Button variant="outline" size="lg" className="w-full mt-4 h-12 rounded-xl border-2 hover:border-primary hover:text-primary">
              <Users className="mr-2 h-5 w-5" />
              Inviter des membres
            </Button>
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {transactions.map((transaction, index) => (
              <Card key={transaction.id} className="p-4 animate-fade-in hover:scale-[1.01] transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {transaction.member}
                    </h3>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${
                      transaction.type === "distribution" 
                        ? "text-success" 
                        : "text-foreground"
                    }`}>
                      {transaction.type === "distribution" ? "+" : ""}
                      {transaction.amount}
                    </p>
                    <p className={`text-xs px-2 py-0.5 rounded-full ${
                      transaction.type === "distribution" 
                        ? "bg-success/10 text-success" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {transaction.type === "distribution" ? "Distribution" : "Versement"}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Button size="lg" className="w-full mt-6 h-14 text-base rounded-xl shadow-primary">
          Effectuer un versement
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default TontineDetails;

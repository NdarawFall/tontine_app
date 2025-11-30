import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Download, Receipt } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useTransactions } from "@/hooks/useTransactions";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState<"all" | "payment" | "distribution">("all");
  
  const { transactions: allTransactions, isLoading: loadingAll, exportToCSV } = useTransactions();
  const { transactions: paymentTransactions, isLoading: loadingPayments } = useTransactions("payment");
  const { transactions: distributionTransactions, isLoading: loadingDistributions } = useTransactions("distribution");

  const transactions = activeTab === "all" ? allTransactions : 
                       activeTab === "payment" ? paymentTransactions : 
                       distributionTransactions;
  
  const isLoading = activeTab === "all" ? loadingAll : 
                   activeTab === "payment" ? loadingPayments : 
                   loadingDistributions;

  const totalPaid = allTransactions?.filter(t => t.type === "payment").reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalReceived = allTransactions?.filter(t => t.type === "distribution").reduce((sum, t) => sum + t.amount, 0) || 0;
  const balance = totalReceived - totalPaid;

  const stats = [
    { label: "Total versé", value: totalPaid.toLocaleString(), color: "text-destructive" },
    { label: "Total reçu", value: totalReceived.toLocaleString(), color: "text-success" },
    { label: "Solde", value: `${balance >= 0 ? '+' : ''}${balance.toLocaleString()}`, color: balance >= 0 ? "text-success" : "text-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-secondary px-6 pt-12 pb-8 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Transactions</h1>
            <p className="text-white/80 text-sm">Historique de vos paiements</p>
          </div>
          <button 
            onClick={exportToCSV}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-lg"
          >
            <Download className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-3 bg-white/10 backdrop-blur-md border-white/20 text-center shadow-lg animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <p className="text-white/80 text-xs mb-1">{stat.label}</p>
              <p className={`font-bold text-sm ${stat.color === "text-success" ? "text-success" : stat.color === "text-destructive" ? "text-destructive" : "text-white"}`}>
                {stat.value} FCFA
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted p-1 h-12">
            <TabsTrigger value="all" className="rounded-xl">Tout</TabsTrigger>
            <TabsTrigger value="payment" className="rounded-xl">Envoyé</TabsTrigger>
            <TabsTrigger value="distribution" className="rounded-xl">Reçu</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-20 w-full" />
                  </Card>
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <Card key={transaction.id} className="p-4 hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                      transaction.type === "payment" 
                        ? "bg-destructive/10" 
                        : "bg-success/10"
                    }`}>
                      {transaction.type === "payment" ? (
                        <ArrowUpRight className="h-6 w-6 text-destructive" />
                      ) : (
                        <ArrowDownLeft className="h-6 w-6 text-success" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {transaction.type === "payment" ? "Cotisation" : transaction.type === "distribution" ? "Distribution" : "Pénalité"}
                          </h3>
                          <p className="text-sm text-muted-foreground">{transaction.tontine?.name || "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            transaction.type === "payment" 
                              ? "text-destructive" 
                              : "text-success"
                          }`}>
                            {transaction.type === "payment" ? "-" : "+"}
                            {transaction.amount.toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {format(new Date(transaction.created_at), "d MMM yyyy • HH:mm", { locale: fr })}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          transaction.status === "completed"
                            ? "bg-success/10 text-success"
                            : transaction.status === "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                        }`}>
                          {transaction.status === "completed" ? "Complété" : transaction.status === "pending" ? "En attente" : "Échoué"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-10 text-center bg-gradient-card">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Receipt className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">Aucune transaction</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Transactions;

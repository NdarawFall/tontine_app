import { useNavigate, useLocation } from "react-router-dom";
import { Home, Plus, Receipt, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Accueil", path: "/dashboard" },
    { icon: Receipt, label: "Transactions", path: "/transactions" },
    { icon: Plus, label: "Créer", path: "/create-tontine", isSpecial: true },
    { icon: Bell, label: "Alertes", path: "/notifications" },
    { icon: User, label: "Profil", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border shadow-xl z-50">
      <div className="flex items-center justify-around h-20 max-w-md mx-auto px-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.isSpecial) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center -mt-10 transition-transform hover:scale-110 active:scale-95"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-primary shadow-lg">
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all min-w-[64px] py-2 px-3 rounded-xl hover:bg-muted/50",
                isActive ? "text-primary scale-105" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-6 w-6 transition-transform", isActive && "scale-110")} />
              <span className={cn("text-xs font-medium", isActive && "font-semibold")}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

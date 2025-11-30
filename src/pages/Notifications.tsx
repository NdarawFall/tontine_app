import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertCircle, TrendingUp, Users, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({ title: "Toutes les notifications ont été marquées comme lues" });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast({ 
        title: "Erreur",
        description: "Impossible de marquer les notifications comme lues",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment': return CheckCircle;
      case 'reminder': return Clock;
      case 'turn': return TrendingUp;
      case 'member': return Users;
      case 'alert': return AlertCircle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'payment': return "text-success bg-success/10";
      case 'reminder': return "text-warning bg-warning/10";
      case 'turn': return "text-primary bg-primary/10";
      case 'member': return "text-accent bg-accent/10";
      case 'alert': return "text-destructive bg-destructive/10";
      default: return "text-foreground bg-muted/10";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-secondary px-6 pt-12 pb-6 rounded-b-[2rem] shadow-xl">
        <div className="flex items-center justify-between mb-2 animate-fade-in">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-semibold shadow-primary animate-pulse-glow">
              {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <p className="text-white/80 text-sm">Restez informé de vos tontines</p>
      </div>

      {/* Actions */}
      {unreadCount > 0 && (
        <div className="px-6 py-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full rounded-xl border-2 hover:border-primary hover:text-primary h-11"
            onClick={markAllAsRead}
          >
            Tout marquer comme lu
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <div className="px-6 space-y-3 pb-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            const color = getNotificationColor(notification.type);
            
            return (
              <Card 
                key={notification.id} 
                className={`p-4 transition-all hover:shadow-lg animate-fade-in ${
                  !notification.read 
                    ? "border-l-4 border-l-primary shadow-md" 
                    : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color} shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`font-semibold text-foreground ${
                        !notification.read ? "font-bold" : ""
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2 shadow-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { 
                        addSuffix: true, 
                        locale: fr 
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        ) : null}

        {notifications.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Bell className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune notification
            </h3>
            <p className="text-muted-foreground">
              Vous êtes à jour !
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Notifications;

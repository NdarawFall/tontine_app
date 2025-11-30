import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import logo from "@/assets/logo-kaydiapsi.png";
import signupIllustration from "@/assets/signup-illustration.png";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        playSound('success');
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, playSound]);

  const handleGoogleSignup = async () => {
    try {
      playSound('click');
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        playSound('error');
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      playSound('error');
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      <button 
        onClick={() => {
          playSound('click');
          navigate("/onboarding");
        }}
        className="absolute top-6 left-6 flex items-center text-muted-foreground hover:text-foreground transition-all hover:-translate-x-1 group z-20"
      >
        <ArrowLeft className="mr-2 h-5 w-5 group-hover:animate-pulse" />
        Retour
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-t-3xl p-8 text-center animate-fade-in">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-72 h-24 bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-rose-300/30 rounded-full blur-2xl" />
          <h1 className="text-4xl font-bold text-white mb-2 relative z-10">
            Inscription
          </h1>
          <p className="text-white/90 text-sm relative z-10">
            Rejoignez Kay Diap Si aujourd'hui
          </p>
        </div>

        {/* Form Card */}
        <Card className="rounded-b-3xl border-t-0 shadow-2xl p-8 bg-white/95 backdrop-blur-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="space-y-6">
            <Button 
              onClick={handleGoogleSignup}
              disabled={isLoading}
              size="lg" 
              className="w-full h-14 text-base group bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 shadow-md rounded-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-3 h-6 w-6 animate-spin text-primary" />
                  <span>Inscription en cours...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-semibold">S'inscrire avec Google</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                En créant un compte, vous acceptez nos conditions d'utilisation
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-gray-700">
            Vous avez déjà un compte ?{" "}
            <button
              onClick={() => {
                playSound('click');
                navigate("/login");
              }}
              className="text-purple-500 font-bold hover:underline hover:scale-105 inline-block transition-all"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

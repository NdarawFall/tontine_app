import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-kaydiapsi.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-primary/20 to-background overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_5s_ease-in-out_infinite_0.5s]" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-[pulse_6s_ease-in-out_infinite_1s]" />
      </div>
      
      <div className="text-center relative z-10">
        {/* Glowing ring around logo */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-[pulse_2s_ease-in-out_infinite]" />
          
          {/* Logo with smooth animations */}
          <div className="relative animate-[fade-in_0.8s_ease-out,scale-in_0.8s_ease-out]">
            <div className="relative">
              <img 
                src={logo} 
                alt="Kay Diap Si - Tontine Sénégal" 
                className="w-40 h-40 mx-auto drop-shadow-2xl animate-[float_3s_ease-in-out_infinite]"
              />
              {/* Rotating circle */}
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-[spin_8s_linear_infinite]" 
                   style={{ borderTopColor: 'hsl(var(--primary))' }} />
            </div>
          </div>
        </div>
        
        {/* Text with staggered animations */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-4 tracking-tight animate-[fade-in_1s_ease-out_0.2s_both]">
            Kay Diap Si
          </h1>
          <p className="text-lg text-muted-foreground font-light animate-[fade-in_1s_ease-out_0.4s_both]">
            Votre tontine digitale au Sénégal
          </p>
          <p className="text-sm text-muted-foreground/70 animate-[fade-in_1s_ease-out_0.6s_both]">
            Épargnez ensemble, gagnez ensemble
          </p>
        </div>

        {/* Enhanced loading indicator */}
        <div className="mt-16 animate-[fade-in_1s_ease-out_0.8s_both]">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-[bounce_1s_ease-in-out_infinite]" />
            <div className="w-3 h-3 bg-primary rounded-full animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
            <div className="w-3 h-3 bg-primary rounded-full animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
          </div>
          <p className="text-xs text-muted-foreground">Chargement...</p>
        </div>
      </div>
    </div>
  );
};

export default Splash;

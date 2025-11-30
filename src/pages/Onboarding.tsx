import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import onboarding1 from "@/assets/onboarding-1.png";
import onboarding2 from "@/assets/onboarding-2.png";
import onboarding3 from "@/assets/onboarding-3.png";

const slides = [
  {
    image: onboarding1,
    title: "Épargnez en Groupe",
    description: "Créez ou rejoignez une tontine avec vos proches en quelques clics"
  },
  {
    image: onboarding2,
    title: "Paiements Sécurisés",
    description: "Effectuez vos cotisations via Mobile Money en toute sécurité"
  },
  {
    image: onboarding3,
    title: "Suivez Vos Gains",
    description: "Consultez en temps réel vos contributions et vos tours de réception"
  }
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/login");
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title}
            className="w-full h-64 object-cover rounded-2xl mb-8 animate-fade-in"
          />
          
          <div className="text-center mb-8 animate-slide-up">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-muted-foreground text-lg">
              {slides[currentSlide].description}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        <div className="flex gap-4 max-w-md mx-auto">
          {currentSlide > 0 && (
            <Button 
              variant="outline" 
              size="lg"
              onClick={handlePrevious}
              className="flex-1"
            >
              <ChevronLeft className="mr-2" />
              Retour
            </Button>
          )}
          
          {currentSlide === 0 && (
            <Button 
              variant="ghost" 
              size="lg"
              onClick={handleSkip}
              className="flex-1"
            >
              Passer
            </Button>
          )}
          
          <Button 
            variant="default" 
            size="lg"
            onClick={handleNext}
            className="flex-1"
          >
            {currentSlide === slides.length - 1 ? "Commencer" : "Suivant"}
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

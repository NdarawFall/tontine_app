import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Loader2, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AvatarCropDialog } from "@/components/AvatarCropDialog";

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    id_number: ""
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil",
          variant: "destructive",
        });
        return;
      }

      setFormData({
        full_name: profileData?.full_name || "",
        phone: profileData?.phone || "",
        email: profileData?.email || "",
        id_number: profileData?.id_number || ""
      });
      setAvatarUrl(profileData?.avatar_url || null);

      setLoading(false);
    };

    loadProfile();
  }, [navigate, toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "L'image ne doit pas dépasser 2 MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImage: Blob) => {
    setUploadingAvatar(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non connecté");

      const fileName = `${user.id}/${Date.now()}.jpg`;

      // Supprimer l'ancien avatar s'il existe
      if (avatarUrl) {
        const oldPath = avatarUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('avatars').remove([oldPath]);
      }

      // Upload le nouveau
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedImage);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Succès",
        description: "Photo de profil mise à jour",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        id_number: formData.id_number
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Votre profil a été mis à jour",
    });

    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = formData.full_name || "Utilisateur";
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-secondary px-6 pt-8 pb-6 sticky top-0 z-10 rounded-b-[2rem] shadow-xl animate-fade-in">
        <button 
          onClick={() => navigate("/profile")}
          className="flex items-center text-white/90 hover:text-white transition-all mb-4 hover:-translate-x-1 group"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:animate-pulse" />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-white">Modifier mon profil</h1>
        <p className="text-white/80 text-sm">Mettez à jour vos informations personnelles</p>
      </div>

      {/* Form */}
      <div className="px-6 py-6 space-y-6">
        {/* Avatar Section */}
        <Card className="p-6 animate-fade-in shadow-lg">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-32 h-32 border-4 border-primary/20 transition-transform hover:scale-105 shadow-xl">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-primary hover:scale-110">
                {uploadingAvatar ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </label>
              
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                ref={fileInputRef}
                disabled={uploadingAvatar}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Cliquez sur l'icône pour changer votre photo
            </p>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-5 animate-fade-in shadow-lg" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h2 className="font-semibold text-foreground text-lg">Informations personnelles</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet *</Label>
                <Input
                  id="full_name"
                  placeholder="Ex: Mamadou Diallo"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                  className="transition-all focus:scale-[1.01] h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ex: +221 77 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  className="transition-all focus:scale-[1.01] h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: exemple@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="transition-all focus:scale-[1.01] h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_number">Numéro d'identification</Label>
                <Input
                  id="id_number"
                  placeholder="Ex: CNI, Passeport..."
                  value={formData.id_number}
                  onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                  className="transition-all focus:scale-[1.01] h-11"
                />
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button type="submit" size="lg" className="w-full transition-all hover:scale-[1.02] h-12 rounded-xl shadow-primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="lg" 
              className="w-full transition-all hover:scale-[1.02] h-12 rounded-xl border-2"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>

      {selectedImage && (
        <AvatarCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
        />
      )}

      <BottomNav />
    </div>
  );
};

export default EditProfile;

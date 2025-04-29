
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Professeur } from "@/data/database";

interface ProfesseurFormProps {
  professeur?: Professeur;
  onSubmit: (professeur: Omit<Professeur, "id">) => void;
  mode: "create" | "edit";
}

const ProfesseurForm = ({ professeur, onSubmit, mode }: ProfesseurFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    specialite: "",
    status: "actif",
    adresse: "",
    biographie: "",
    diplome: ""
  });

  useEffect(() => {
    if (professeur && mode === "edit") {
      setFormData({
        nom: professeur.nom,
        prenom: professeur.prenom,
        email: professeur.email,
        telephone: professeur.telephone,
        specialite: professeur.specialite,
        status: professeur.status,
        adresse: professeur.adresse || "",
        biographie: professeur.biographie || "",
        diplome: professeur.diplome
      });
    }
  }, [professeur, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.email || !formData.specialite || !formData.diplome) {
      toast.error("Formulaire incomplet", {
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }

    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email invalide", {
        description: "Veuillez entrer une adresse email valide."
      });
      return;
    }

    onSubmit({
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      specialite: formData.specialite,
      status: formData.status as "actif" | "inactif",
      adresse: formData.adresse,
      biographie: formData.biographie,
      diplome: formData.diplome
    });
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/professeurs")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Prénom du professeur"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom du professeur"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemple.fr"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialite">Spécialité enseignée *</Label>
            <Input
              id="specialite"
              name="specialite"
              value={formData.specialite}
              onChange={handleChange}
              placeholder="Ex: Mathématiques"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diplome">Diplôme *</Label>
            <Input
              id="diplome"
              name="diplome"
              value={formData.diplome}
              onChange={handleChange}
              placeholder="Ex: Master en Mathématiques"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Input
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="Adresse complète"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="biographie">Biographie</Label>
          <Textarea
            id="biographie"
            name="biographie"
            value={formData.biographie}
            onChange={handleChange}
            placeholder="Quelques informations sur le professeur"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/professeurs")}
          >
            Annuler
          </Button>
          <Button type="submit">
            {mode === "create" ? "Ajouter le professeur" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfesseurForm;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Eleve } from "@/data/database";

interface EleveFormProps {
  eleve?: Eleve;
  onSubmit: (eleve: Omit<Eleve, "id">) => void;
  mode: "create" | "edit";
}

const EleveForm = ({ eleve, onSubmit, mode }: EleveFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    niveau: "",
    telParents: "",
    dateInscription: new Date().toISOString().split("T")[0],
    adresse: "",
    notes: ""
  });

  useEffect(() => {
    if (eleve && mode === "edit") {
      setFormData({
        nom: eleve.nom,
        prenom: eleve.prenom,
        email: eleve.email,
        telephone: eleve.telephone,
        niveau: eleve.niveau,
        telParents: eleve.telParents,
        dateInscription: eleve.dateInscription.split("T")[0],
        adresse: eleve.adresse || "",
        notes: eleve.notes || ""
      });
    }
  }, [eleve, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.email || !formData.niveau || !formData.telParents) {
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
      niveau: formData.niveau,
      telParents: formData.telParents,
      dateInscription: formData.dateInscription,
      adresse: formData.adresse,
      notes: formData.notes
    });
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/eleves")}
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
              placeholder="Prénom de l'élève"
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
              placeholder="Nom de l'élève"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email des parents *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="parents@exemple.fr"
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
            <Label htmlFor="niveau">Niveau scolaire *</Label>
            <Input
              id="niveau"
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              placeholder="Ex: Terminale S"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telParents">Téléphone des parents *</Label>
            <Input
              id="telParents"
              name="telParents"
              value={formData.telParents}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateInscription">Date d'inscription</Label>
            <Input
              id="dateInscription"
              name="dateInscription"
              type="date"
              value={formData.dateInscription}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="adresse">Adresse</Label>
          <Input
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="Adresse complète"
          />
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Informations supplémentaires sur l'élève"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/eleves")}
          >
            Annuler
          </Button>
          <Button type="submit">
            {mode === "create" ? "Ajouter l'élève" : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EleveForm;

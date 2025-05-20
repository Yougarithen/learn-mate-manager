
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EleveForm from "@/components/eleves/EleveForm";
import axios from "axios";

interface EleveFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  niveau: string;
  telParents: string;
  dateInscription: string;
  adresse?: string;
  notes?: string;
}

const AjouterEleve = () => {
  const navigate = useNavigate();

  const handleSubmit = async (eleveData: EleveFormData) => {
    try {
      // Appel à l'API pour ajouter l'élève
      await axios.post('http://localhost:3000/api/eleves', eleveData);
      
      // Notification de succès
      toast.success("Élève ajouté", {
        description: `${eleveData.prenom} ${eleveData.nom} a été ajouté avec succès`,
      });
      
      // Redirection vers la liste des élèves
      navigate("/eleves");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'élève:", error);
      toast.error("Erreur lors de l'ajout", {
        description: "Une erreur s'est produite lors de l'ajout de l'élève. Veuillez réessayer."
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un Élève</h1>
        <p className="text-muted-foreground">
          Complétez le formulaire pour ajouter un nouvel élève.
        </p>
      </div>

      <EleveForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
};

export default AjouterEleve;

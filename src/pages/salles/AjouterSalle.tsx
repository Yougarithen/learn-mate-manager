
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SalleForm from "@/components/salles/SalleForm";
import axios from "axios";

interface SalleFormData {
  nom: string;
  capacite: number;
  adresse?: string;
  equipement?: string;
  status: "disponible" | "indisponible";
}

const AjouterSalle = () => {
  const navigate = useNavigate();

  const handleSubmit = async (salleData: SalleFormData) => {
    try {
      // Appel à l'API pour ajouter la salle
      await axios.post('http://localhost:3000/api/salles', salleData);
      
      // Notification de succès
      toast.success("Salle ajoutée", {
        description: `La salle ${salleData.nom} a été ajoutée avec succès`,
      });
      
      // Redirection vers la liste des salles
      navigate("/salles");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la salle:", error);
      toast.error("Erreur lors de l'ajout", {
        description: "Une erreur s'est produite lors de l'ajout de la salle. Veuillez réessayer."
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter une Salle</h1>
        <p className="text-muted-foreground">
          Complétez le formulaire pour ajouter une nouvelle salle.
        </p>
      </div>

      <SalleForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
};

export default AjouterSalle;

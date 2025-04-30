
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SalleForm from "@/components/salles/SalleForm";
import { addSalle, Salle } from "@/data/database";

const AjouterSalle = () => {
  const navigate = useNavigate();

  const handleSubmit = (salleData: Omit<Salle, "id">) => {
    // Ajout de la salle dans notre "base de données"
    const newSalle = addSalle(salleData);
    
    // Notification de succès
    toast.success("Salle ajoutée", {
      description: `La salle ${newSalle.nom} a été ajoutée avec succès`,
    });
    
    // Redirection vers la liste des salles
    navigate("/salles");
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

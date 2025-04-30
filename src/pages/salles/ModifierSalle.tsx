
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SalleForm from "@/components/salles/SalleForm";
import { getSalleById, updateSalle, Salle } from "@/data/database";

const ModifierSalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [salle, setSalle] = useState<Salle | null>(null);

  useEffect(() => {
    if (id) {
      const salleData = getSalleById(id);
      if (salleData) {
        setSalle(salleData);
      } else {
        toast.error("Salle introuvable");
        navigate("/salles");
      }
    }
  }, [id, navigate]);

  const handleSubmit = (salleData: Omit<Salle, "id">) => {
    if (id) {
      // Mise à jour de la salle dans notre "base de données"
      const updatedSalle = updateSalle(id, salleData);
      
      if (updatedSalle) {
        // Notification de succès
        toast.success("Salle modifiée", {
          description: `La salle ${updatedSalle.nom} a été modifiée avec succès`,
        });
        
        // Redirection vers la liste des salles
        navigate("/salles");
      } else {
        toast.error("Erreur lors de la modification de la salle");
      }
    }
  };

  if (!salle) {
    return <div>Chargement...</div>;
  }

  // On exclut l'ID pour obtenir seulement les champs modifiables
  const { id: salleId, ...defaultValues } = salle;

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Modifier une Salle</h1>
        <p className="text-muted-foreground">
          Modifiez les informations de la salle {salle.nom}.
        </p>
      </div>

      <SalleForm 
        onSubmit={handleSubmit} 
        defaultValues={defaultValues}
        mode="update" 
      />
    </div>
  );
};

export default ModifierSalle;

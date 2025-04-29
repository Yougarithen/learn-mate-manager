
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProfesseurForm from "@/components/professeurs/ProfesseurForm";
import { getProfesseurById, updateProfesseur, Professeur } from "@/data/database";

const ModifierProfesseur = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professeur, setProfesseur] = useState<Professeur | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProfesseur = getProfesseurById(id);
      
      if (foundProfesseur) {
        setProfesseur(foundProfesseur);
      } else {
        toast.error("Professeur non trouvé", {
          description: "Le professeur que vous essayez de modifier n'existe pas.",
        });
        navigate("/professeurs");
      }
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handleSubmit = (professeurData: Omit<Professeur, "id">) => {
    if (id) {
      // Mise à jour du professeur dans notre "base de données"
      const updatedProfesseur = updateProfesseur(id, professeurData);
      
      if (updatedProfesseur) {
        // Notification de succès
        toast.success("Professeur modifié", {
          description: `${updatedProfesseur.prenom} ${updatedProfesseur.nom} a été modifié avec succès`,
        });
        
        // Redirection vers la liste des professeurs
        navigate("/professeurs");
      } else {
        toast.error("Erreur lors de la modification", {
          description: "Une erreur est survenue lors de la modification du professeur.",
        });
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Modifier un Professeur</h1>
        <p className="text-muted-foreground">
          Modifiez les informations du professeur.
        </p>
      </div>

      {professeur && (
        <ProfesseurForm 
          professeur={professeur} 
          onSubmit={handleSubmit} 
          mode="edit" 
        />
      )}
    </div>
  );
};

export default ModifierProfesseur;

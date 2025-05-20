
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EleveForm from "@/components/eleves/EleveForm";
import axios from "axios";

interface Eleve {
  id: string;
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

const ModifierEleve = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eleve, setEleve] = useState<Eleve | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/eleves/${id}`)
        .then(response => {
          setEleve(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur lors du chargement de l'élève:", err);
          toast.error("Élève non trouvé", {
            description: "L'élève que vous essayez de modifier n'existe pas.",
          });
          navigate("/eleves");
        });
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handleSubmit = async (eleveData: Omit<Eleve, "id">) => {
    if (id) {
      try {
        // Mise à jour de l'élève via l'API
        await axios.put(`http://localhost:3000/api/eleves/${id}`, eleveData);
        
        // Notification de succès
        toast.success("Élève modifié", {
          description: `${eleveData.prenom} ${eleveData.nom} a été modifié avec succès`,
        });
        
        // Redirection vers la liste des élèves
        navigate("/eleves");
      } catch (error) {
        console.error("Erreur lors de la modification de l'élève:", error);
        toast.error("Erreur lors de la modification", {
          description: "Une erreur est survenue lors de la modification de l'élève."
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
        <h1 className="text-3xl font-bold tracking-tight">Modifier un Élève</h1>
        <p className="text-muted-foreground">
          Modifiez les informations de l'élève.
        </p>
      </div>

      {eleve && (
        <EleveForm 
          eleve={eleve} 
          onSubmit={handleSubmit} 
          mode="edit" 
        />
      )}
    </div>
  );
};

export default ModifierEleve;

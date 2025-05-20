
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CoursForm, { CoursFormData } from "@/components/cours/CoursForm";
import axios from "axios";

interface Cours {
  id: string;
  matiere: string;
  niveau: string;
  salaireParHeure: number;
  description?: string;
}

const ModifierCours = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cours, setCours] = useState<Cours | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/cours/${id}`)
        .then(response => {
          setCours(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur lors du chargement du cours:", err);
          toast.error("Cours introuvable");
          navigate("/cours");
        });
    }
  }, [id, navigate]);

  const handleSubmit = async (coursData: CoursFormData) => {
    try {
      // On extrait professeurId et salleId car ils ne font pas partie
      // du type Cours sur le backend
      const { professeurId, salleId, ...coursToUpdate } = coursData;
      
      // Mise à jour du cours via l'API
      await axios.put(`http://localhost:3000/api/cours/${id}`, coursToUpdate);
      
      // Notification de succès
      toast.success("Cours modifié", {
        description: `Le cours de ${coursData.matiere} (${coursData.niveau}) a été modifié avec succès`,
      });
      
      // Redirection vers la liste des cours
      navigate("/cours");
    } catch (error) {
      console.error("Erreur lors de la modification du cours:", error);
      toast.error("Erreur de modification", {
        description: "Une erreur s'est produite lors de la modification du cours."
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (!cours) {
    return <div>Cours introuvable</div>;
  }

  // Préparation des valeurs par défaut pour le formulaire
  const defaultValues = {
    matiere: cours.matiere,
    niveau: cours.niveau,
    salaireParHeure: cours.salaireParHeure,
    description: cours.description || "",
    professeurId: "", // Ces champs seront remplis par l'utilisateur
    salleId: ""       // Ces champs seront remplis par l'utilisateur
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Modifier un Cours</h1>
        <p className="text-muted-foreground">
          Modifiez les informations du cours {cours.matiere} ({cours.niveau}).
        </p>
      </div>

      <CoursForm 
        onSubmit={handleSubmit} 
        defaultValues={defaultValues}
        mode="update" 
      />
    </div>
  );
};

export default ModifierCours;

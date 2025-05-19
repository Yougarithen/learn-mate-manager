
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CoursForm, { CoursFormData } from "@/components/cours/CoursForm";
import axios from "axios";

const AjouterCours = () => {
  const navigate = useNavigate();

  const handleSubmit = async (coursData: CoursFormData) => {
    try {
      // Nous ne passons pas professeurId et salleId au API car ils ne font pas partie
      // du type Cours, mais nous pourrions les stocker dans une table de relation
      const { professeurId, salleId, ...coursToAdd } = coursData;
      
      // Appel à l'API pour ajouter le cours
      const response = await axios.post('http://localhost:3000/api/cours', coursToAdd);
      const newCours = response.data;
      
      // Notification de succès
      toast.success("Cours ajouté", {
        description: `Le cours de ${newCours.matiere} (${newCours.niveau}) a été ajouté avec succès`,
      });
      
      // Redirection vers la liste des cours
      navigate("/cours");
    } catch (error) {
      console.error("Erreur lors de l'ajout du cours:", error);
      toast.error("Erreur lors de l'ajout du cours", {
        description: "Une erreur s'est produite lors de l'ajout du cours. Veuillez réessayer."
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un Cours</h1>
        <p className="text-muted-foreground">
          Complétez le formulaire pour ajouter un nouveau cours.
        </p>
      </div>

      <CoursForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
};

export default AjouterCours;

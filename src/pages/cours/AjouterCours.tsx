
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CoursForm, { CoursFormData } from "@/components/cours/CoursForm";
import { addCours } from "@/data/database";

const AjouterCours = () => {
  const navigate = useNavigate();

  const handleSubmit = (coursData: CoursFormData) => {
    // Nous ne passons pas professeurId et salleId au addCours car ils ne font pas partie
    // du type Cours, mais nous pourrions les stocker dans une table de relation
    const { professeurId, salleId, ...coursToAdd } = coursData;
    
    // Ajout du cours dans notre "base de données"
    const newCours = addCours(coursToAdd);
    
    // Notification de succès
    toast.success("Cours ajouté", {
      description: `Le cours de ${newCours.matiere} (${newCours.niveau}) a été ajouté avec succès`,
    });
    
    // Redirection vers la liste des cours
    navigate("/cours");
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

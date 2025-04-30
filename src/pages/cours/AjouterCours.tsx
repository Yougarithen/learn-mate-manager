
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CoursForm from "@/components/cours/CoursForm";
import { addCours, Cours } from "@/data/database";

const AjouterCours = () => {
  const navigate = useNavigate();

  const handleSubmit = (coursData: Omit<Cours, "id">) => {
    // Ajout du cours dans notre "base de données"
    const newCours = addCours(coursData);
    
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


import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProfesseurForm from "@/components/professeurs/ProfesseurForm";
import { addProfesseur, Professeur } from "@/data/database";

const AjouterProfesseur = () => {
  const navigate = useNavigate();

  const handleSubmit = (professeurData: Omit<Professeur, "id">) => {
    // Ajout du professeur dans notre "base de données"
    const newProfesseur = addProfesseur(professeurData);
    
    // Notification de succès
    toast.success("Professeur ajouté", {
      description: `${newProfesseur.prenom} ${newProfesseur.nom} a été ajouté avec succès`,
    });
    
    // Redirection vers la liste des professeurs
    navigate("/professeurs");
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un Professeur</h1>
        <p className="text-muted-foreground">
          Complétez le formulaire pour ajouter un nouveau professeur.
        </p>
      </div>

      <ProfesseurForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
};

export default AjouterProfesseur;

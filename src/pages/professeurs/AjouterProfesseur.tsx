
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import ProfesseurForm from "@/components/professeurs/ProfesseurForm";
import { Professeur } from "@/components/professeurs/ProfesseursDataTable";

const AjouterProfesseur = () => {
  const navigate = useNavigate();

  const handleSubmit = (professeurData: Omit<Professeur, "id">) => {
    // Dans une application réelle, on enverrait les données à une API
    console.log("Ajout d'un nouveau professeur:", professeurData);
    
    // Notification de succès
    toast.success("Professeur ajouté", {
      description: `${professeurData.prenom} ${professeurData.nom} a été ajouté avec succès`,
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

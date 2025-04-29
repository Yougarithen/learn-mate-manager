
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EleveForm from "@/components/eleves/EleveForm";
import { addEleve, Eleve } from "@/data/database";

const AjouterEleve = () => {
  const navigate = useNavigate();

  const handleSubmit = (eleveData: Omit<Eleve, "id">) => {
    // Ajout de l'élève dans notre "base de données"
    const newEleve = addEleve(eleveData);
    
    // Notification de succès
    toast.success("Élève ajouté", {
      description: `${newEleve.prenom} ${newEleve.nom} a été ajouté avec succès`,
    });
    
    // Redirection vers la liste des élèves
    navigate("/eleves");
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter un Élève</h1>
        <p className="text-muted-foreground">
          Complétez le formulaire pour ajouter un nouvel élève.
        </p>
      </div>

      <EleveForm onSubmit={handleSubmit} mode="create" />
    </div>
  );
};

export default AjouterEleve;

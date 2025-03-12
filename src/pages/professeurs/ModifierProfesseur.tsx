
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import ProfesseurForm from "@/components/professeurs/ProfesseurForm";
import { Professeur } from "@/components/professeurs/ProfesseursDataTable";

// Données fictives pour la démo
const professeurs: Professeur[] = [
  {
    id: "1",
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@email.fr",
    telephone: "06 12 34 56 78",
    matiere: "Mathématiques",
    status: "actif",
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Philippe",
    email: "philippe.martin@email.fr",
    telephone: "06 23 45 67 89",
    matiere: "Physique-Chimie",
    status: "actif",
  },
  {
    id: "3",
    nom: "Laurent",
    prenom: "Sophie",
    email: "sophie.laurent@email.fr",
    telephone: "06 34 56 78 90",
    matiere: "Français",
    status: "actif",
  },
  {
    id: "4",
    nom: "Petit",
    prenom: "Thomas",
    email: "thomas.petit@email.fr",
    telephone: "06 45 67 89 01",
    matiere: "Histoire-Géographie",
    status: "inactif",
  },
  {
    id: "5",
    nom: "Bernard",
    prenom: "Julie",
    email: "julie.bernard@email.fr",
    telephone: "06 56 78 90 12",
    matiere: "Anglais",
    status: "actif",
  },
];

const ModifierProfesseur = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professeur, setProfesseur] = useState<Professeur | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dans une application réelle, on ferait un appel API
    const foundProfesseur = professeurs.find((p) => p.id === id);
    
    if (foundProfesseur) {
      setProfesseur(foundProfesseur);
    } else {
      toast.error("Professeur non trouvé", {
        description: "Le professeur que vous essayez de modifier n'existe pas.",
      });
      navigate("/professeurs");
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handleSubmit = (professeurData: Omit<Professeur, "id">) => {
    // Dans une application réelle, on enverrait les données à une API
    console.log("Mise à jour du professeur:", { id, ...professeurData });
    
    // Notification de succès
    toast.success("Professeur modifié", {
      description: `${professeurData.prenom} ${professeurData.nom} a été modifié avec succès`,
    });
    
    // Redirection vers la liste des professeurs
    navigate("/professeurs");
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

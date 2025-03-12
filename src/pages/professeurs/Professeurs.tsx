
import { useState, useEffect } from "react";
import ProfesseursDataTable, { Professeur } from "@/components/professeurs/ProfesseursDataTable";

// Données de professeurs fictives pour la démo
const initialProfesseurs: Professeur[] = [
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

const Professeurs = () => {
  // Dans une application réelle, on récupérerait les données depuis une API
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);

  useEffect(() => {
    // Simulation d'un appel API
    setProfesseurs(initialProfesseurs);
  }, []);

  const handleDelete = (id: string) => {
    setProfesseurs(professeurs.filter((prof) => prof.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Professeurs</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des professeurs.
        </p>
      </div>

      <ProfesseursDataTable data={professeurs} onDelete={handleDelete} />
    </div>
  );
};

export default Professeurs;

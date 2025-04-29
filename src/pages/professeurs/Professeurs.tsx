
import { useState, useEffect } from "react";
import ProfesseursDataTable from "@/components/professeurs/ProfesseursDataTable";
import { getProfesseurs, deleteProfesseur, Professeur } from "@/data/database";

const Professeurs = () => {
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);

  useEffect(() => {
    // Chargement des données depuis notre "base de données"
    setProfesseurs(getProfesseurs());
  }, []);

  const handleDelete = (id: string) => {
    const success = deleteProfesseur(id);
    if (success) {
      setProfesseurs(getProfesseurs());
    }
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

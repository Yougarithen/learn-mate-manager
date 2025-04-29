
import { useState, useEffect } from "react";
import ElevesDataTable from "@/components/eleves/ElevesDataTable";
import { getEleves, deleteEleve, Eleve } from "@/data/database";

const Eleves = () => {
  const [eleves, setEleves] = useState<Eleve[]>([]);

  useEffect(() => {
    // Chargement des données depuis notre "base de données"
    setEleves(getEleves());
  }, []);

  const handleDelete = (id: string) => {
    const success = deleteEleve(id);
    if (success) {
      setEleves(getEleves());
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Élèves</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des élèves.
        </p>
      </div>

      <ElevesDataTable data={eleves} onDelete={handleDelete} />
    </div>
  );
};

export default Eleves;

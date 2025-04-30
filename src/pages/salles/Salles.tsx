
import { useState, useEffect } from "react";
import { getSalles, deleteSalle, Salle } from "@/data/database";
import { toast } from "sonner";
import SallesDataTable from "@/components/salles/SallesDataTable";

const Salles = () => {
  const [salles, setSalles] = useState<Salle[]>([]);

  useEffect(() => {
    // Chargement des données depuis notre "base de données"
    setSalles(getSalles());
  }, []);

  const handleDelete = (id: string) => {
    const success = deleteSalle(id);
    if (success) {
      setSalles(getSalles());
      toast.success("Salle supprimée", {
        description: "La salle a été supprimée avec succès",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Salles</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des salles.
        </p>
      </div>

      <SallesDataTable data={salles} onDelete={handleDelete} />
    </div>
  );
};

export default Salles;

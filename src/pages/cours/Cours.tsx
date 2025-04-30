
import { useState, useEffect } from "react";
import { getCours, deleteCours, Cours as CoursType } from "@/data/database";
import { toast } from "sonner";
import CoursDataTable from "@/components/cours/CoursDataTable";

const Cours = () => {
  const [cours, setCours] = useState<CoursType[]>([]);

  useEffect(() => {
    // Chargement des données depuis notre "base de données"
    setCours(getCours());
  }, []);

  const handleDelete = (id: string) => {
    const success = deleteCours(id);
    if (success) {
      setCours(getCours());
      toast.success("Cours supprimé", {
        description: "Le cours a été supprimé avec succès",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Cours</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des cours.
        </p>
      </div>

      <CoursDataTable data={cours} onDelete={handleDelete} />
    </div>
  );
};

export default Cours;

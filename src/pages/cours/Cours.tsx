
import { useState, useEffect } from "react";
import { toast } from "sonner";
import CoursDataTable from "@/components/cours/CoursDataTable";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import axios from "axios";

interface Cours {
  id: string;
  matiere: string;
  niveau: string;
  salaireParHeure: number;
  description?: string;
}

const Cours = () => {
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCours = () => {
    setLoading(true);
    axios.get("http://localhost:3000/api/cours")
      .then(response => {
        setCours(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des cours:", err);
        setError("Impossible de charger la liste des cours");
        setLoading(false);
        toast.error("Erreur de chargement", {
          description: "Impossible de récupérer la liste des cours"
        });
      });
  };

  useEffect(() => {
    fetchCours();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3000/api/cours/${id}`)
      .then(() => {
        fetchCours();
        toast.success("Cours supprimé", {
          description: "Le cours a été supprimé avec succès",
        });
      })
      .catch(err => {
        console.error("Erreur lors de la suppression du cours:", err);
        toast.error("Erreur de suppression", {
          description: "Impossible de supprimer le cours"
        });
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Cours</h1>
          <p className="text-muted-foreground">
            Consultez, ajoutez, modifiez ou supprimez des cours.
          </p>
        </div>
        <Button asChild>
          <Link to="/cours/ajouter">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un cours
          </Link>
        </Button>
      </div>

      <CoursDataTable data={cours} onDelete={handleDelete} />
    </div>
  );
};

export default Cours;


import { useState, useEffect } from "react";
import { toast } from "sonner";
import SallesDataTable from "@/components/salles/SallesDataTable";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface Salle {
  id: string;
  nom: string;
  capacite: number;
  adresse?: string;
  equipement?: string;
  status: "disponible" | "indisponible";
}

const Salles = () => {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalles = () => {
    setLoading(true);
    axios.get("http://localhost:3000/api/salles")
      .then(response => {
        setSalles(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des salles:", err);
        setError("Impossible de charger la liste des salles");
        setLoading(false);
        toast.error("Erreur de chargement", {
          description: "Impossible de récupérer la liste des salles"
        });
      });
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3000/api/salles/${id}`)
      .then(() => {
        fetchSalles();
        toast.success("Salle supprimée", {
          description: "La salle a été supprimée avec succès",
        });
      })
      .catch(err => {
        console.error("Erreur lors de la suppression de la salle:", err);
        toast.error("Erreur de suppression", {
          description: "Impossible de supprimer la salle"
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
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Salles</h1>
          <p className="text-muted-foreground">
            Consultez, ajoutez, modifiez ou supprimez des salles.
          </p>
        </div>
        <Button asChild>
          <Link to="/salles/ajouter">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une salle
          </Link>
        </Button>
      </div>

      <SallesDataTable data={salles} onDelete={handleDelete} />
    </div>
  );
};

export default Salles;

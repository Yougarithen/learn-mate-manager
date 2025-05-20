
import { useState, useEffect } from "react";
import ElevesDataTable from "@/components/eleves/ElevesDataTable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import axios from "axios";

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  niveau: string;
  telParents: string;
  dateInscription: string;
  adresse?: string;
  notes?: string;
}

const Eleves = () => {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEleves = () => {
    setLoading(true);
    axios.get("http://localhost:3000/api/eleves")
      .then(response => {
        setEleves(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des élèves:", err);
        setError("Impossible de charger la liste des élèves");
        setLoading(false);
        toast.error("Erreur de chargement", {
          description: "Impossible de récupérer la liste des élèves"
        });
      });
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3000/api/eleves/${id}`)
      .then(() => {
        fetchEleves();
        toast.success("Élève supprimé", {
          description: "L'élève a été supprimé avec succès",
        });
      })
      .catch(err => {
        console.error("Erreur lors de la suppression de l'élève:", err);
        toast.error("Erreur de suppression", {
          description: "Impossible de supprimer l'élève"
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
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Élèves</h1>
          <p className="text-muted-foreground">
            Consultez, ajoutez, modifiez ou supprimez des élèves.
          </p>
        </div>
        <Button asChild>
          <Link to="/eleves/ajouter">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un élève
          </Link>
        </Button>
      </div>

      <ElevesDataTable data={eleves} onDelete={handleDelete} />
    </div>
  );
};

export default Eleves;

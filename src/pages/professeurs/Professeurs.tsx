
import { useState, useEffect } from "react";
import ProfesseursDataTable from "@/components/professeurs/ProfesseursDataTable";
import { toast } from "sonner";
import axios from "axios";

interface Professeur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  diplome: string;
  specialite: string;
  status: "actif" | "inactif";
  adresse?: string;
  biographie?: string;
}

const Professeurs = () => {
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfesseurs = () => {
    setLoading(true);
    axios.get("http://localhost:3000/api/professeurs")
      .then(response => {
        setProfesseurs(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des professeurs:", err);
        setError("Impossible de charger la liste des professeurs");
        setLoading(false);
        toast.error("Erreur de chargement", {
          description: "Impossible de récupérer la liste des professeurs"
        });
      });
  };

  useEffect(() => {
    fetchProfesseurs();
  }, []);

  const handleDelete = (id: string) => {
    axios.delete(`http://localhost:3000/api/professeurs/${id}`)
      .then(() => {
        fetchProfesseurs();
        toast.success("Professeur supprimé", {
          description: "Le professeur a été supprimé avec succès",
        });
      })
      .catch(err => {
        console.error("Erreur lors de la suppression du professeur:", err);
        toast.error("Erreur de suppression", {
          description: "Impossible de supprimer le professeur"
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

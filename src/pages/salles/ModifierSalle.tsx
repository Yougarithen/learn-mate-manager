
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import SalleForm from "@/components/salles/SalleForm";
import axios from "axios";

interface Salle {
  id: string;
  nom: string;
  capacite: number;
  adresse?: string;
  equipement?: string;
  status: "disponible" | "indisponible";
}

interface SalleFormData {
  nom: string;
  capacite: number;
  adresse?: string;
  equipement?: string;
  status: "disponible" | "indisponible";
}

const ModifierSalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [salle, setSalle] = useState<Salle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/salles/${id}`)
        .then(response => {
          setSalle(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur lors du chargement de la salle:", err);
          toast.error("Salle introuvable");
          navigate("/salles");
        });
    }
  }, [id, navigate]);

  const handleSubmit = async (salleData: SalleFormData) => {
    try {
      // Mise à jour de la salle via l'API
      await axios.put(`http://localhost:3000/api/salles/${id}`, salleData);
      
      // Notification de succès
      toast.success("Salle modifiée", {
        description: `La salle ${salleData.nom} a été modifiée avec succès`,
      });
      
      // Redirection vers la liste des salles
      navigate("/salles");
    } catch (error) {
      console.error("Erreur lors de la modification de la salle:", error);
      toast.error("Erreur de modification", {
        description: "Une erreur s'est produite lors de la modification de la salle."
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (!salle) {
    return <div>Salle introuvable</div>;
  }

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Modifier une Salle</h1>
        <p className="text-muted-foreground">
          Modifiez les informations de la salle {salle.nom}.
        </p>
      </div>

      <SalleForm 
        onSubmit={handleSubmit} 
        defaultValues={{
          nom: salle.nom,
          capacite: salle.capacite,
          adresse: salle.adresse,
          equipement: salle.equipement,
          status: salle.status
        }}
        mode="update" 
      />
    </div>
  );
};

export default ModifierSalle;

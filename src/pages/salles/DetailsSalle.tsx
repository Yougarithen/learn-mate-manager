
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";
import axios from "axios";

interface Salle {
  id: string;
  nom: string;
  capacite: number;
  adresse?: string;
  equipement?: string;
  status: "disponible" | "indisponible";
}

const DetailsSalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [salle, setSalle] = useState<Salle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://localhost:3000/api/salles/${id}`)
        .then(response => {
          setSalle(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Erreur lors du chargement de la salle:", err);
          setError("Impossible de charger les détails de la salle");
          setLoading(false);
          if (err.response && err.response.status === 404) {
            navigate("/salles");
          }
        });
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (error || !salle) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500">{error || "Salle non trouvée"}</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/salles">Retour à la liste des salles</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{salle.nom}</h1>
          <p className="text-muted-foreground">
            Informations détaillées sur la salle
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/salles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/salles/modifier/${salle.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la salle</CardTitle>
          <CardDescription>
            Informations complètes sur la salle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nom</p>
              <p>{salle.nom}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Capacité</p>
              <p>{salle.capacite} places</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Adresse</p>
            <p>{salle.adresse || "Non spécifiée"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Équipement</p>
            <p>{salle.equipement || "Aucun équipement spécifié"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Statut</p>
            <Badge variant={salle.status === "disponible" ? "default" : "secondary"}>
              {salle.status === "disponible" ? "Disponible" : "Indisponible"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsSalle;

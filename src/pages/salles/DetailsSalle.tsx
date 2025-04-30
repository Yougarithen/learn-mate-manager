
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getSalleById, Salle } from "@/data/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit } from "lucide-react";

const DetailsSalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [salle, setSalle] = useState<Salle | null>(null);

  useEffect(() => {
    if (id) {
      const salleData = getSalleById(id);
      if (salleData) {
        setSalle(salleData);
      } else {
        navigate("/salles");
      }
    }
  }, [id, navigate]);

  if (!salle) {
    return <div>Chargement...</div>;
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
            <p>{salle.adresse}</p>
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

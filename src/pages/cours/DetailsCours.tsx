
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getCoursById, Cours } from "@/data/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";

const DetailsCours = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cours, setCours] = useState<Cours | null>(null);

  useEffect(() => {
    if (id) {
      const coursData = getCoursById(id);
      if (coursData) {
        setCours(coursData);
      } else {
        navigate("/cours");
      }
    }
  }, [id, navigate]);

  if (!cours) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{cours.matiere}</h1>
          <p className="text-muted-foreground">
            Informations détaillées sur le cours
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/cours">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/cours/modifier/${cours.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du cours</CardTitle>
          <CardDescription>
            Informations complètes sur le cours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Matière</p>
              <p>{cours.matiere}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Niveau</p>
              <p>{cours.niveau}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Salaire horaire</p>
            <p>{cours.salaireParHeure} €/h</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Description</p>
            <p>{cours.description || "Aucune description spécifiée"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailsCours;

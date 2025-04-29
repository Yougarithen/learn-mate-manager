
import { useState, useEffect } from "react";
import { getSalles, Salle } from "@/data/database";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Salles = () => {
  const [salles, setSalles] = useState<Salle[]>([]);

  useEffect(() => {
    // Chargement des données depuis notre "base de données"
    setSalles(getSalles());
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Salles</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des salles.
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter une salle
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Capacité</TableHead>
            <TableHead>Adresse</TableHead>
            <TableHead>Équipement</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salles.map((salle) => (
            <TableRow key={salle.id}>
              <TableCell className="font-medium">{salle.nom}</TableCell>
              <TableCell>{salle.capacite} places</TableCell>
              <TableCell>{salle.adresse}</TableCell>
              <TableCell>{salle.equipement}</TableCell>
              <TableCell>
                <Badge variant={salle.status === "disponible" ? "default" : "secondary"}>
                  {salle.status === "disponible" ? "Disponible" : "Indisponible"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Salles;

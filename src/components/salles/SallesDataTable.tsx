
import { useState } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { Salle } from "@/data/database";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SallesDataTableProps {
  data: Salle[];
  onDelete: (id: string) => void;
}

const SallesDataTable = ({ data, onDelete }: SallesDataTableProps) => {
  const [salleToDelete, setSalleToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSalleToDelete(id);
  };

  const confirmDelete = () => {
    if (salleToDelete) {
      onDelete(salleToDelete);
      setSalleToDelete(null);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button asChild>
          <Link to="/salles/ajouter">Ajouter une salle</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Capacité</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Équipement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Aucune salle trouvée
                </TableCell>
              </TableRow>
            ) : (
              data.map((salle) => (
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/salles/${salle.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/salles/modifier/${salle.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(salle.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer la salle {salle.nom} ?
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default SallesDataTable;

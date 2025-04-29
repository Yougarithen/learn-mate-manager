
import { useState, useEffect } from "react";
import { getEleves, Eleve } from "@/data/database";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Eleves = () => {
  const [eleves, setEleves] = useState<Eleve[]>([]);

  useEffect(() => {
    // Chargement des données depuis notre "base de données"
    setEleves(getEleves());
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Élèves</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des élèves.
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un élève
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Date d'inscription</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eleves.map((eleve) => (
            <TableRow key={eleve.id}>
              <TableCell className="font-medium">{eleve.nom}</TableCell>
              <TableCell>{eleve.prenom}</TableCell>
              <TableCell>{eleve.niveau}</TableCell>
              <TableCell>
                <div>{eleve.email}</div>
                <div className="text-muted-foreground">Tel. parents: {eleve.telParents}</div>
              </TableCell>
              <TableCell>{new Date(eleve.dateInscription).toLocaleDateString('fr-FR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Eleves;

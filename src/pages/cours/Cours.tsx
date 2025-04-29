
import { useState, useEffect } from "react";
import { getCours, Cours as CoursType } from "@/data/database";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Cours = () => {
  const [cours, setCours] = useState<CoursType[]>([]);

  useEffect(() => {
    // Chargement des données depuis notre "base de données"
    setCours(getCours());
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Cours</h1>
        <p className="text-muted-foreground">
          Consultez, ajoutez, modifiez ou supprimez des cours.
        </p>
      </div>
      
      <div className="flex justify-end mb-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un cours
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Matière</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Salaire horaire</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cours.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.matiere}</TableCell>
              <TableCell>{c.niveau}</TableCell>
              <TableCell>{c.salaireParHeure} €/h</TableCell>
              <TableCell>{c.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Cours;


import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Search, Plus, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Professeur } from "@/data/database";

interface ProfesseursDataTableProps {
  data: Professeur[];
  onDelete: (id: string) => void;
}

const ProfesseursDataTable = ({ data, onDelete }: ProfesseursDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [professorToDelete, setProfessorToDelete] = useState<Professeur | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const filteredData = data.filter(
    (prof) =>
      prof.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.specialite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (professeur: Professeur) => {
    setProfessorToDelete(professeur);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (professorToDelete) {
      onDelete(professorToDelete.id);
      setIsDeleteDialogOpen(false);
      setProfessorToDelete(null);
      toast.success("Professeur supprimé", {
        description: `${professorToDelete.prenom} ${professorToDelete.nom} a été supprimé`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un professeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button asChild>
          <Link to="/professeurs/ajouter">
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Link>
        </Button>
      </div>

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Professeur</TableHead>
              <TableHead>Spécialité</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserRound className="h-10 w-10 mb-2" />
                    <p>Aucun professeur trouvé</p>
                    {searchTerm && (
                      <p className="text-sm">
                        Essayez avec d'autres termes de recherche
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell>
                    <Link to={`/professeurs/${prof.id}`} className="font-medium hover:underline">
                      {prof.prenom} {prof.nom}
                    </Link>
                  </TableCell>
                  <TableCell>{prof.specialite}</TableCell>
                  <TableCell className="text-sm">
                    <div>{prof.email}</div>
                    <div className="text-muted-foreground">{prof.telephone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prof.status === "actif" ? "default" : "secondary"}>
                      {prof.status === "actif" ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={`/professeurs/modifier/${prof.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(prof)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le professeur {" "}
              <span className="font-medium">
                {professorToDelete?.prenom} {professorToDelete?.nom}
              </span> ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfesseursDataTable;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, Search, Plus, UserRound, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eleve } from "@/data/database";

interface ElevesDataTableProps {
  data: Eleve[];
  onDelete: (id: string) => void;
}

const ElevesDataTable = ({ data, onDelete }: ElevesDataTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eleveToDelete, setEleveToDelete] = useState<Eleve | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const filteredData = data.filter(
    (eleve) =>
      eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.niveau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (eleve: Eleve) => {
    setEleveToDelete(eleve);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (eleveToDelete) {
      onDelete(eleveToDelete.id);
      setIsDeleteDialogOpen(false);
      setEleveToDelete(null);
      toast.success("Élève supprimé", {
        description: `${eleveToDelete.prenom} ${eleveToDelete.nom} a été supprimé`
      });
    }
  };

  const handleCreateReceipt = (eleveId: string) => {
    // Naviguer vers la page de finances avec l'ID de l'élève préselectionné
    navigate(`/finance?tab=nouveau-recu&eleveId=${eleveId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button asChild>
          <Link to="/eleves/ajouter">
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Link>
        </Button>
      </div>

      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Élève</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date d'inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserRound className="h-10 w-10 mb-2" />
                    <p>Aucun élève trouvé</p>
                    {searchTerm && (
                      <p className="text-sm">
                        Essayez avec d'autres termes de recherche
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((eleve) => (
                <TableRow key={eleve.id}>
                  <TableCell>
                    <Link to={`/eleves/${eleve.id}`} className="font-medium hover:underline">
                      {eleve.prenom} {eleve.nom}
                    </Link>
                  </TableCell>
                  <TableCell>{eleve.niveau}</TableCell>
                  <TableCell className="text-sm">
                    <div>{eleve.email}</div>
                    <div className="text-muted-foreground">Parents: {eleve.telParents}</div>
                  </TableCell>
                  <TableCell>{new Date(eleve.dateInscription).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        title="Générer un reçu"
                        onClick={() => handleCreateReceipt(eleve.id)}
                      >
                        <Receipt className="h-4 w-4" />
                        <span className="sr-only">Reçu</span>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={`/eleves/modifier/${eleve.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifier</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(eleve)}
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
              Êtes-vous sûr de vouloir supprimer l'élève {" "}
              <span className="font-medium">
                {eleveToDelete?.prenom} {eleveToDelete?.nom}
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

export default ElevesDataTable;

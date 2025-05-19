
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { getEleveById, deleteEleve, getProgrammationsForEleve, getProgrammations, getRecuPaiementsForEleve, getPaiementById, getCoursById, Eleve, Programmation } from "@/data/database";
import Timetable from "@/components/eleves/Timetable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiptGenerator from "@/components/eleves/ReceiptGenerator";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DetailsEleve = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eleve, setEleve] = useState<Eleve | undefined>(undefined);
  const [programmations, setProgrammations] = useState<Programmation[]>([]);
  const [receptionsPaiement, setReceptionsPaiement] = useState<any[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const foundEleve = getEleveById(id);
      if (foundEleve) {
        setEleve(foundEleve);
        
        // Récupérer les programmations pour cet élève
        const elevePrograms = getProgrammationsForEleve(id);
        setProgrammations(elevePrograms);
        
        // Récupérer l'historique des paiements
        const recus = getRecuPaiementsForEleve(id);
        const recusWithDetails = recus.map(recu => {
          const paiement = getPaiementById(recu.paiementId);
          const cours = recu.coursIds.map(coursId => {
            const c = getCoursById(coursId);
            return c ? c.matiere : "Cours inconnu";
          }).join(", ");
          
          return {
            ...recu,
            paiement,
            cours
          };
        });
        setReceptionsPaiement(recusWithDetails);
      } else {
        toast.error("Élève non trouvé");
        navigate("/eleves");
      }
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (id) {
      const success = deleteEleve(id);
      if (success) {
        toast.success("Élève supprimé", {
          description: `${eleve?.prenom} ${eleve?.nom} a été supprimé avec succès`,
        });
        navigate("/eleves");
      } else {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const formatWeekday = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE', { locale: fr }) + ' ' + format(date, 'dd/MM/yyyy');
  };

  if (!eleve) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => navigate("/eleves")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
        </Button>
        <div className="flex gap-2">
          <ReceiptGenerator eleve={eleve} />
          <Button asChild variant="outline">
            <Link to={`/eleves/modifier/${id}`}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{eleve.prenom} {eleve.nom}</CardTitle>
            <CardDescription>Niveau: {eleve.niveau}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info">
              <TabsList className="mb-4">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="seances">Séances</TabsTrigger>
                <TabsTrigger value="paiements">Paiements</TabsTrigger>
                <TabsTrigger value="timetable">Emploi du temps</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Contact</h3>
                    <p>{eleve.email}</p>
                    <p>{eleve.telephone}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Contact parents</h3>
                    <p>{eleve.telParents}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Date d'inscription</h3>
                    <p>{new Date(eleve.dateInscription).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Adresse</h3>
                    <p>{eleve.adresse || "Non renseignée"}</p>
                  </div>
                </div>
                {eleve.notes && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Notes</h3>
                    <p className="whitespace-pre-line">{eleve.notes}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="seances">
                <div className="space-y-4">
                  <h3 className="font-medium mb-2">Séances programmées</h3>
                  {programmations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Aucune séance programmée pour cet élève
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Jour</TableHead>
                          <TableHead>Matière</TableHead>
                          <TableHead>Durée</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {programmations.map((prog) => {
                          const cours = getCoursById(prog.coursId);
                          return (
                            <TableRow key={prog.id}>
                              <TableCell>
                                {formatWeekday(prog.date)}{' '}
                                {prog.heure}
                              </TableCell>
                              <TableCell>{cours?.matiere || "Cours inconnu"}</TableCell>
                              <TableCell>{prog.duree} min</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="paiements">
                <div className="space-y-4">
                  <h3 className="font-medium mb-2">Historique des paiements</h3>
                  {receptionsPaiement.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Aucun historique de paiement pour cet élève
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Cours</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Mode de paiement</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {receptionsPaiement.map((recu) => (
                          <TableRow key={recu.id}>
                            <TableCell>
                              {format(new Date(recu.date), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell>{recu.cours}</TableCell>
                            <TableCell>
                              {recu.paiement ? `${recu.paiement.montant.toFixed(2)} €` : "-"}
                            </TableCell>
                            <TableCell>
                              {recu.paiement ? recu.paiement.methode : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="timetable">
                <Timetable programmations={programmations} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'élève{" "}
              <span className="font-medium">{eleve.prenom} {eleve.nom}</span> ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailsEleve;

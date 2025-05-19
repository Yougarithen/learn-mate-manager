
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  getProfesseurById, 
  deleteProfesseur, 
  getProgrammationsForProfesseur, 
  getCoursById,
  Professeur,
  Programmation 
} from "@/data/database";
import PaySlipGenerator from "@/components/professeurs/PaySlipGenerator";

const DetailsProfesseur = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professeur, setProfesseur] = useState<Professeur | undefined>(undefined);
  const [programmations, setProgrammations] = useState<Programmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProfesseur = getProfesseurById(id);
      
      if (foundProfesseur) {
        setProfesseur(foundProfesseur);
        setProgrammations(getProgrammationsForProfesseur(id));
      } else {
        toast.error("Professeur non trouvé", {
          description: "Le professeur que vous cherchez n'existe pas.",
        });
        navigate("/professeurs");
      }
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handleDelete = () => {
    if (id) {
      const success = deleteProfesseur(id);
      
      if (success && professeur) {
        // Notification de succès
        toast.success("Professeur supprimé", {
          description: `${professeur.prenom} ${professeur.nom} a été supprimé avec succès`,
        });
        
        // Redirection vers la liste des professeurs
        navigate("/professeurs");
      } else {
        toast.error("Erreur lors de la suppression", {
          description: "Une erreur est survenue lors de la suppression du professeur.",
        });
      }
    }
  };

  const getTitreCours = (coursId: string) => {
    const cours = getCoursById(coursId);
    return cours ? cours.matiere : "Cours inconnu";
  };

  const formaterDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (!professeur) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/professeurs")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste
      </Button>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {professeur.prenom} {professeur.nom}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <span className="mr-2">Professeur de {professeur.specialite}</span>
                    <Badge variant={professeur.status === "actif" ? "default" : "secondary"}>
                      {professeur.status === "actif" ? "Actif" : "Inactif"}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <PaySlipGenerator professeur={professeur} />
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/professeurs/modifier/${professeur.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cours">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="cours">Cours</TabsTrigger>
                  <TabsTrigger value="eleves">Élèves</TabsTrigger>
                  <TabsTrigger value="infos">Informations</TabsTrigger>
                </TabsList>
                <TabsContent value="cours" className="py-4">
                  <h3 className="text-lg font-medium mb-4">Cours enseignés</h3>
                  <div className="space-y-4">
                    {programmations.length > 0 ? (
                      programmations.map((prog) => (
                        <div key={prog.id} className="border rounded-md p-3 bg-card">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{getTitreCours(prog.coursId)}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formaterDate(prog.date)}, {prog.heure} • {prog.duree} min
                              </p>
                            </div>
                            <Badge variant="outline">{prog.elevesIds.length} élèves</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        Aucun cours programmé pour ce professeur.
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="eleves" className="py-4">
                  <h3 className="text-lg font-medium mb-4">Élèves encadrés</h3>
                  <p className="text-muted-foreground">
                    Ce professeur encadre actuellement {programmations.reduce((acc, prog) => acc + prog.elevesIds.length, 0)} élèves répartis sur {programmations.length} cours différents.
                  </p>
                  <div className="mt-4 text-center py-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">
                      La liste détaillée des élèves sera disponible ici.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="infos" className="py-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Coordonnées</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{professeur.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{professeur.telephone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Diplôme</h3>
                      <p className="text-muted-foreground">
                        {professeur.diplome}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Adresse</h3>
                      <p className="text-muted-foreground">
                        {professeur.adresse || "Non renseignée"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Biographie</h3>
                      <p className="text-muted-foreground">
                        {professeur.biographie || "Aucune biographie disponible."}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le professeur {" "}
              <span className="font-medium">
                {professeur.prenom} {professeur.nom}
              </span> ? 
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

export default DetailsProfesseur;

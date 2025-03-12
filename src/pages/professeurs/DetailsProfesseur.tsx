
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Professeur } from "@/components/professeurs/ProfesseursDataTable";

// Données fictives pour la démo
const professeurs: Professeur[] = [
  {
    id: "1",
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@email.fr",
    telephone: "06 12 34 56 78",
    matiere: "Mathématiques",
    status: "actif",
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Philippe",
    email: "philippe.martin@email.fr",
    telephone: "06 23 45 67 89",
    matiere: "Physique-Chimie",
    status: "actif",
  },
  {
    id: "3",
    nom: "Laurent",
    prenom: "Sophie",
    email: "sophie.laurent@email.fr",
    telephone: "06 34 56 78 90",
    matiere: "Français",
    status: "actif",
  },
  {
    id: "4",
    nom: "Petit",
    prenom: "Thomas",
    email: "thomas.petit@email.fr",
    telephone: "06 45 67 89 01",
    matiere: "Histoire-Géographie",
    status: "inactif",
  },
  {
    id: "5",
    nom: "Bernard",
    prenom: "Julie",
    email: "julie.bernard@email.fr",
    telephone: "06 56 78 90 12",
    matiere: "Anglais",
    status: "actif",
  },
];

// Cours fictifs pour la démo
const coursFictifs = [
  { id: "1", titre: "Algèbre Fondamentale", jour: "Lundi", horaire: "09:00 - 10:30", salle: "Salle 101", nbEleves: 15 },
  { id: "2", titre: "Géométrie", jour: "Mardi", horaire: "14:00 - 15:30", salle: "Salle 203", nbEleves: 12 },
  { id: "3", titre: "Statistiques", jour: "Jeudi", horaire: "10:45 - 12:15", salle: "Salle 105", nbEleves: 18 },
];

const DetailsProfesseur = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professeur, setProfesseur] = useState<Professeur | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Dans une application réelle, on ferait un appel API
    const foundProfesseur = professeurs.find((p) => p.id === id);
    
    if (foundProfesseur) {
      setProfesseur(foundProfesseur);
    } else {
      toast.error("Professeur non trouvé", {
        description: "Le professeur que vous cherchez n'existe pas.",
      });
      navigate("/professeurs");
    }
    
    setLoading(false);
  }, [id, navigate]);

  const handleDelete = () => {
    // Dans une application réelle, on enverrait une requête de suppression à l'API
    console.log("Suppression du professeur:", id);
    
    // Notification de succès
    if (professeur) {
      toast.success("Professeur supprimé", {
        description: `${professeur.prenom} ${professeur.nom} a été supprimé avec succès`,
      });
    }
    
    // Redirection vers la liste des professeurs
    navigate("/professeurs");
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
        <div className="lg:w-2/3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {professeur.prenom} {professeur.nom}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <span className="mr-2">Professeur de {professeur.matiere}</span>
                    <Badge variant={professeur.status === "actif" ? "default" : "secondary"}>
                      {professeur.status === "actif" ? "Actif" : "Inactif"}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
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
                    {coursFictifs.map((cours) => (
                      <div key={cours.id} className="border rounded-md p-3 bg-card">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{cours.titre}</h4>
                            <p className="text-sm text-muted-foreground">
                              {cours.jour}, {cours.horaire} • {cours.salle}
                            </p>
                          </div>
                          <Badge variant="outline">{cours.nbEleves} élèves</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="eleves" className="py-4">
                  <h3 className="text-lg font-medium mb-4">Élèves encadrés</h3>
                  <p className="text-muted-foreground">
                    Ce professeur encadre actuellement 45 élèves répartis sur 3 cours différents.
                  </p>
                  {/* Liste des élèves - pour la démo, on affiche un message */}
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
                      <h3 className="text-lg font-medium mb-2">Adresse</h3>
                      <p className="text-muted-foreground">
                        123 Rue de l'Académie, 75001 Paris
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Notes</h3>
                      <p className="text-muted-foreground">
                        Aucune note pour ce professeur.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Cours enseignés</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total d'élèves</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Heures par semaine</span>
                <span className="font-medium">12h</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Depuis</span>
                <span className="font-medium">Septembre 2022</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                Assigner un cours
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Envoyer un message
              </Button>
              <Button className="w-full justify-start" variant="outline">
                Générer un rapport
              </Button>
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

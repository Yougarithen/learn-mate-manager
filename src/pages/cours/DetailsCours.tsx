
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getCoursById, getProgrammations, getEleveById, updateProgrammation, Cours, Programmation, Eleve } from "@/data/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, UserMinus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const DetailsCours = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cours, setCours] = useState<Cours | null>(null);
  const [elevesInscrits, setElevesInscrits] = useState<Eleve[]>([]);
  const [programmations, setProgrammations] = useState<Programmation[]>([]);
  const [eleveToRemove, setEleveToRemove] = useState<{elevId: string, progId: string} | null>(null);

  useEffect(() => {
    if (id) {
      const coursData = getCoursById(id);
      if (coursData) {
        setCours(coursData);
        
        // Récupérer toutes les programmations liées à ce cours
        const allProgrammations = getProgrammations().filter(prog => prog.coursId === id);
        setProgrammations(allProgrammations);
        
        // Récupérer tous les élèves inscrits dans ces programmations
        const eleveIds = new Set<string>();
        allProgrammations.forEach(prog => {
          prog.elevesIds.forEach(eleveId => {
            eleveIds.add(eleveId);
          });
        });
        
        // Récupérer les informations des élèves
        const eleves = Array.from(eleveIds)
          .map(eleveId => getEleveById(eleveId))
          .filter((eleve): eleve is Eleve => eleve !== undefined);
        
        setElevesInscrits(eleves);
      } else {
        navigate("/cours");
      }
    }
  }, [id, navigate]);

  const handleRemoveEleve = (elevId: string, progId: string) => {
    setEleveToRemove({ elevId, progId });
  };

  const confirmRemoveEleve = () => {
    if (!eleveToRemove) return;
    
    const { elevId, progId } = eleveToRemove;
    const programmation = programmations.find(prog => prog.id === progId);
    
    if (programmation) {
      // Filtrer l'élève de la liste des élèves inscrits
      const updatedElevesIds = programmation.elevesIds.filter(id => id !== elevId);
      
      // Mettre à jour la programmation
      const success = updateProgrammation(progId, {
        ...programmation,
        elevesIds: updatedElevesIds
      });
      
      if (success) {
        toast.success("Élève retiré du cours", {
          description: "L'élève a été retiré du cours avec succès"
        });
        
        // Mettre à jour la liste des programmations
        const updatedProgrammations = programmations.map(prog => 
          prog.id === progId ? { ...prog, elevesIds: updatedElevesIds } : prog
        );
        setProgrammations(updatedProgrammations);
        
        // Mettre à jour la liste des élèves inscrits si l'élève n'est plus dans aucune programmation
        const isEleveStillEnrolled = updatedProgrammations.some(prog => 
          prog.elevesIds.includes(elevId)
        );
        
        if (!isEleveStillEnrolled) {
          setElevesInscrits(elevesInscrits.filter(eleve => eleve.id !== elevId));
        }
      } else {
        toast.error("Erreur lors du retrait de l'élève");
      }
    }
    
    setEleveToRemove(null);
  };

  // Fonction pour obtenir le jour de la semaine
  const getJourSemaine = (dateStr: string) => {
    const date = new Date(dateStr);
    const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return joursSemaine[date.getDay()];
  };

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

      <div className="grid grid-cols-1 gap-6">
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
              <p>{cours.salaireParHeure} DA/h</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p>{cours.description || "Aucune description spécifiée"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Élèves inscrits</CardTitle>
            <CardDescription>
              Les élèves actuellement inscrits à ce cours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {elevesInscrits.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">Aucun élève inscrit à ce cours</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Niveau</TableHead>
                    <TableHead>Séance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {elevesInscrits.map(eleve => {
                    // Trouver les programmations où cet élève est inscrit
                    const elevePrograms = programmations.filter(prog => 
                      prog.elevesIds.includes(eleve.id)
                    );
                    
                    return elevePrograms.map(prog => (
                      <TableRow key={`${eleve.id}-${prog.id}`}>
                        <TableCell>{eleve.nom}</TableCell>
                        <TableCell>{eleve.prenom}</TableCell>
                        <TableCell>{eleve.niveau}</TableCell>
                        <TableCell>{getJourSemaine(prog.date)} à {prog.heure}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" 
                                onClick={() => handleRemoveEleve(eleve.id, prog.id)}>
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Retirer l'élève du cours</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir retirer {eleve.prenom} {eleve.nom} de ce cours ?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmRemoveEleve}>
                                  Confirmer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DetailsCours;

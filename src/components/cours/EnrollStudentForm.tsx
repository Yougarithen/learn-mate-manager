
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEleves, getProgrammations, updateProgrammation, Eleve, Programmation } from "@/data/database";
import { UserPlus } from "lucide-react";

interface EnrollStudentFormProps {
  coursId: string;
  onEnrollSuccess: () => void;
}

const EnrollStudentForm = ({ coursId, onEnrollSuccess }: EnrollStudentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEleveId, setSelectedEleveId] = useState("");
  const [selectedProgId, setSelectedProgId] = useState("");
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [programmations, setProgrammations] = useState<Programmation[]>([]);
  const [alreadyEnrolledIds, setAlreadyEnrolledIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Charger toutes les programmations liées à ce cours
    const progs = getProgrammations().filter(p => p.coursId === coursId);
    setProgrammations(progs);
    
    // Récupérer tous les IDs d'élèves déjà inscrits
    const enrolledIds = new Set<string>();
    progs.forEach(p => {
      p.elevesIds.forEach(id => enrolledIds.add(id));
    });
    setAlreadyEnrolledIds(enrolledIds);
    
    // Filtrer les élèves qui ne sont pas déjà inscrits
    const elevesList = getEleves();
    setEleves(elevesList);
  }, [coursId]);
  
  const handleEnroll = () => {
    if (!selectedEleveId || !selectedProgId) {
      toast.error("Veuillez sélectionner un élève et une programmation");
      return;
    }
    
    const programmation = programmations.find(p => p.id === selectedProgId);
    if (!programmation) {
      toast.error("Programmation non trouvée");
      return;
    }
    
    // Ajouter l'élève à la programmation
    const updatedProg = {
      ...programmation,
      elevesIds: [...programmation.elevesIds, selectedEleveId]
    };
    
    const success = updateProgrammation(selectedProgId, updatedProg);
    
    if (success) {
      toast.success("Élève inscrit au cours", {
        description: "L'élève a été inscrit avec succès"
      });
      setIsOpen(false);
      onEnrollSuccess();
    } else {
      toast.error("Erreur lors de l'inscription");
    }
  };
  
  const filteredEleves = eleves.filter(e => !alreadyEnrolledIds.has(e.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Inscrire un élève
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inscrire un élève</DialogTitle>
          <DialogDescription>
            Sélectionnez un élève et une séance pour l'inscrire à ce cours.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="eleve" className="text-sm font-medium">Élève</label>
            <Select onValueChange={setSelectedEleveId} value={selectedEleveId}>
              <SelectTrigger id="eleve">
                <SelectValue placeholder="Sélectionner un élève" />
              </SelectTrigger>
              <SelectContent>
                {filteredEleves.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Tous les élèves sont déjà inscrits
                  </SelectItem>
                ) : (
                  filteredEleves.map(eleve => (
                    <SelectItem key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom} - {eleve.niveau}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="programmation" className="text-sm font-medium">Séance</label>
            <Select onValueChange={setSelectedProgId} value={selectedProgId}>
              <SelectTrigger id="programmation">
                <SelectValue placeholder="Sélectionner une séance" />
              </SelectTrigger>
              <SelectContent>
                {programmations.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Aucune séance disponible
                  </SelectItem>
                ) : (
                  programmations.map(prog => {
                    const jour = new Date(prog.date).toLocaleDateString('fr-FR', { weekday: 'long' });
                    return (
                      <SelectItem key={prog.id} value={prog.id}>
                        {jour} à {prog.heure} ({prog.duree} min)
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleEnroll} disabled={!selectedEleveId || !selectedProgId}>
            Inscrire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollStudentForm;

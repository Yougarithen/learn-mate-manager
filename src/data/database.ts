
import professeurs from './professeurs.json';
import eleves from './eleves.json';
import cours from './cours.json';
import salles from './salles.json';
import programmations from './programmations.json';
import paiements from './paiements.json';
import fichePaies from './fichePaies.json';
import recuPaiements from './recuPaiements.json';
import { v4 as uuidv4 } from 'uuid';

// Types définis selon le diagramme de classes
export interface Personne {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

export interface Professeur extends Personne {
  diplome: string;
  specialite: string;
  status: "actif" | "inactif";
  adresse?: string;
  biographie?: string;
}

export interface Eleve extends Personne {
  niveau: string;
  telParents: string;
  dateInscription: string;
  adresse?: string;
  notes?: string;
}

export interface Cours {
  id: string;
  matiere: string;
  niveau: string;
  salaireParHeure: number;
  description?: string;
}

export interface Salle {
  id: string;
  nom: string;
  capacite: number;
  adresse?: string;
  equipement?: string;
  status: "disponible" | "indisponible";
}

export interface Programmation {
  id: string;
  coursId: string;
  professeurId: string;
  salleId: string;
  date: string;
  heure: string;
  duree: number; // en minutes
  elevesIds: string[];
}

export interface Paiement {
  id: string;
  montant: number;
  date: string;
  methode: string;
  reference: string;
}

export interface FichePaie {
  id: string;
  professeurId: string;
  totalHeures: number;
  totalSalaire: number;
  date: string;
  programmationIds: string[];
  paiementId: string;
}

export interface RecuPaiement {
  id: string;
  eleveId: string;
  paiementId: string;
  coursIds: string[];
  date: string;
}

// Fonction utilitaire pour sauvegarder les données dans le stockage local
const sauvegarderDonnees = <T>(cle: string, donnees: T[]): void => {
  try {
    localStorage.setItem(cle, JSON.stringify(donnees));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde des données ${cle}:`, error);
  }
};

// Fonction utilitaire pour charger les données depuis le stockage local
const chargerDonnees = <T>(cle: string, donneesPardDefaut: T[]): T[] => {
  try {
    const donnees = localStorage.getItem(cle);
    return donnees ? JSON.parse(donnees) : donneesPardDefaut;
  } catch (error) {
    console.error(`Erreur lors du chargement des données ${cle}:`, error);
    return donneesPardDefaut;
  }
};

// Initialisation des données dans le stockage local au chargement de l'application
let professeursData: Professeur[] = chargerDonnees<Professeur>('professeurs', professeurs as Professeur[]);
let elevesData: Eleve[] = chargerDonnees<Eleve>('eleves', eleves as Eleve[]);
let coursData: Cours[] = chargerDonnees<Cours>('cours', cours as Cours[]);
let sallesData: Salle[] = chargerDonnees<Salle>('salles', salles as Salle[]);
let programmationsData: Programmation[] = chargerDonnees<Programmation>('programmations', programmations as Programmation[]);
let paiementsData: Paiement[] = chargerDonnees<Paiement>('paiements', paiements as Paiement[]);
let fichePaiesData: FichePaie[] = chargerDonnees<FichePaie>('fichePaies', fichePaies as FichePaie[]);
let recuPaiementsData: RecuPaiement[] = chargerDonnees<RecuPaiement>('recuPaiements', recuPaiements as RecuPaiement[]);

// Professeurs
export const getProfesseurs = (): Professeur[] => {
  return professeursData;
};

export const getProfesseurById = (id: string): Professeur | undefined => {
  return professeursData.find(prof => prof.id === id);
};

export const addProfesseur = (professeur: Omit<Professeur, "id">): Professeur => {
  const newProfesseur = { ...professeur, id: uuidv4() } as Professeur;
  professeursData.push(newProfesseur);
  sauvegarderDonnees<Professeur>('professeurs', professeursData);
  return newProfesseur;
};

export const updateProfesseur = (id: string, professeur: Omit<Professeur, "id">): Professeur | undefined => {
  const index = professeursData.findIndex(prof => prof.id === id);
  if (index !== -1) {
    const updatedProfesseur = { ...professeur, id } as Professeur;
    professeursData[index] = updatedProfesseur;
    sauvegarderDonnees<Professeur>('professeurs', professeursData);
    return updatedProfesseur;
  }
  return undefined;
};

export const deleteProfesseur = (id: string): boolean => {
  const index = professeursData.findIndex(prof => prof.id === id);
  if (index !== -1) {
    professeursData.splice(index, 1);
    sauvegarderDonnees<Professeur>('professeurs', professeursData);
    return true;
  }
  return false;
};

// Élèves
export const getEleves = (): Eleve[] => {
  return elevesData;
};

export const getEleveById = (id: string): Eleve | undefined => {
  return elevesData.find(eleve => eleve.id === id);
};

export const addEleve = (eleve: Omit<Eleve, "id">): Eleve => {
  const newEleve = { ...eleve, id: uuidv4() } as Eleve;
  elevesData.push(newEleve);
  sauvegarderDonnees<Eleve>('eleves', elevesData);
  return newEleve;
};

export const updateEleve = (id: string, eleve: Omit<Eleve, "id">): Eleve | undefined => {
  const index = elevesData.findIndex(e => e.id === id);
  if (index !== -1) {
    const updatedEleve = { ...eleve, id } as Eleve;
    elevesData[index] = updatedEleve;
    sauvegarderDonnees<Eleve>('eleves', elevesData);
    return updatedEleve;
  }
  return undefined;
};

export const deleteEleve = (id: string): boolean => {
  const index = elevesData.findIndex(e => e.id === id);
  if (index !== -1) {
    elevesData.splice(index, 1);
    sauvegarderDonnees<Eleve>('eleves', elevesData);
    return true;
  }
  return false;
};

// Cours
export const getCours = (): Cours[] => {
  return coursData;
};

export const getCoursById = (id: string): Cours | undefined => {
  return coursData.find(c => c.id === id);
};

export const addCours = (cours: Omit<Cours, "id">): Cours => {
  const newCours = { ...cours, id: uuidv4() } as Cours;
  coursData.push(newCours);
  sauvegarderDonnees<Cours>('cours', coursData);
  return newCours;
};

export const updateCours = (id: string, cours: Omit<Cours, "id">): Cours | undefined => {
  const index = coursData.findIndex(c => c.id === id);
  if (index !== -1) {
    const updatedCours = { ...cours, id } as Cours;
    coursData[index] = updatedCours;
    sauvegarderDonnees<Cours>('cours', coursData);
    return updatedCours;
  }
  return undefined;
};

export const deleteCours = (id: string): boolean => {
  const index = coursData.findIndex(c => c.id === id);
  if (index !== -1) {
    coursData.splice(index, 1);
    sauvegarderDonnees<Cours>('cours', coursData);
    return true;
  }
  return false;
};

// Salles
export const getSalles = (): Salle[] => {
  return sallesData;
};

export const getSalleById = (id: string): Salle | undefined => {
  return sallesData.find(salle => salle.id === id);
};

export const addSalle = (salle: Omit<Salle, "id">): Salle => {
  const newSalle = { ...salle, id: uuidv4() } as Salle;
  sallesData.push(newSalle);
  sauvegarderDonnees<Salle>('salles', sallesData);
  return newSalle;
};

export const updateSalle = (id: string, salle: Omit<Salle, "id">): Salle | undefined => {
  const index = sallesData.findIndex(s => s.id === id);
  if (index !== -1) {
    const updatedSalle = { ...salle, id } as Salle;
    sallesData[index] = updatedSalle;
    sauvegarderDonnees<Salle>('salles', sallesData);
    return updatedSalle;
  }
  return undefined;
};

export const deleteSalle = (id: string): boolean => {
  const index = sallesData.findIndex(s => s.id === id);
  if (index !== -1) {
    sallesData.splice(index, 1);
    sauvegarderDonnees<Salle>('salles', sallesData);
    return true;
  }
  return false;
};

// Programmations
export const getProgrammations = (): Programmation[] => {
  return programmationsData;
};

export const getProgrammationById = (id: string): Programmation | undefined => {
  return programmationsData.find(prog => prog.id === id);
};

export const getProgrammationsForProfesseur = (professeurId: string): Programmation[] => {
  return programmationsData.filter(prog => prog.professeurId === professeurId);
};

export const getProgrammationsForEleve = (eleveId: string): Programmation[] => {
  return programmationsData.filter(prog => prog.elevesIds.includes(eleveId));
};

export const addProgrammation = (programmation: Omit<Programmation, "id">): Programmation => {
  const newProgrammation = { ...programmation, id: uuidv4() } as Programmation;
  programmationsData.push(newProgrammation);
  sauvegarderDonnees<Programmation>('programmations', programmationsData);
  return newProgrammation;
};

export const updateProgrammation = (id: string, programmation: Omit<Programmation, "id">): Programmation | undefined => {
  const index = programmationsData.findIndex(p => p.id === id);
  if (index !== -1) {
    const updatedProgrammation = { ...programmation, id } as Programmation;
    programmationsData[index] = updatedProgrammation;
    sauvegarderDonnees<Programmation>('programmations', programmationsData);
    return updatedProgrammation;
  }
  return undefined;
};

export const deleteProgrammation = (id: string): boolean => {
  const index = programmationsData.findIndex(p => p.id === id);
  if (index !== -1) {
    programmationsData.splice(index, 1);
    sauvegarderDonnees<Programmation>('programmations', programmationsData);
    return true;
  }
  return false;
};

// Fonction utilitaire pour générer une fiche de paie
export const genererFichePaie = (professeurId: string, mois: number, annee: number): FichePaie | undefined => {
  const professeur = getProfesseurById(professeurId);
  if (!professeur) return undefined;
  
  const debut = new Date(annee, mois - 1, 1);
  const fin = new Date(annee, mois, 0);
  
  const progsProfesseur = programmationsData.filter(prog => {
    const progDate = new Date(prog.date);
    return prog.professeurId === professeurId && 
           progDate >= debut && 
           progDate <= fin;
  });
  
  if (progsProfesseur.length === 0) return undefined;
  
  let totalHeures = 0;
  const programmationIds: string[] = [];
  
  progsProfesseur.forEach(prog => {
    totalHeures += prog.duree / 60; // Convertir minutes en heures
    programmationIds.push(prog.id);
  });
  
  // On suppose que tous les cours du professeur ont le même taux horaire pour simplifier
  const coursId = progsProfesseur[0].coursId;
  const cours = getCoursById(coursId);
  const tauxHoraire = cours ? cours.salaireParHeure : 25; // Valeur par défaut
  
  const totalSalaire = totalHeures * tauxHoraire;
  
  const newPaiement: Paiement = {
    id: uuidv4(),
    montant: totalSalaire,
    date: new Date().toISOString(),
    methode: "virement",
    reference: `PAIE-${professeur.nom}-${mois}-${annee}`
  };
  
  paiementsData.push(newPaiement);
  sauvegarderDonnees<Paiement>('paiements', paiementsData);
  
  const fichePaie: FichePaie = {
    id: uuidv4(),
    professeurId,
    totalHeures,
    totalSalaire,
    date: new Date().toISOString(),
    programmationIds,
    paiementId: newPaiement.id
  };
  
  fichePaiesData.push(fichePaie);
  sauvegarderDonnees<FichePaie>('fichePaies', fichePaiesData);
  
  return fichePaie;
};

// Paiements
export const getPaiements = (): Paiement[] => {
  return paiementsData;
};

export const getPaiementById = (id: string): Paiement | undefined => {
  return paiementsData.find(p => p.id === id);
};

export const addPaiement = (paiement: Omit<Paiement, "id">): Paiement => {
  const newPaiement = { ...paiement, id: uuidv4() } as Paiement;
  paiementsData.push(newPaiement);
  sauvegarderDonnees<Paiement>('paiements', paiementsData);
  return newPaiement;
};

// Reçus de paiement
export const getRecuPaiements = (): RecuPaiement[] => {
  return recuPaiementsData;
};

export const getRecuPaiementById = (id: string): RecuPaiement | undefined => {
  return recuPaiementsData.find(r => r.id === id);
};

export const getRecuPaiementsForEleve = (eleveId: string): RecuPaiement[] => {
  return recuPaiementsData.filter(r => r.eleveId === eleveId);
};

export const addRecuPaiement = (recuPaiement: Omit<RecuPaiement, "id">): RecuPaiement => {
  const newRecuPaiement = { ...recuPaiement, id: uuidv4() } as RecuPaiement;
  recuPaiementsData.push(newRecuPaiement);
  sauvegarderDonnees<RecuPaiement>('recuPaiements', recuPaiementsData);
  return newRecuPaiement;
};

// Export par défaut pour accès rapide
export default {
  professeurs: professeursData,
  eleves: elevesData,
  cours: coursData,
  salles: sallesData,
  programmations: programmationsData,
  paiements: paiementsData,
  fichePaies: fichePaiesData,
  recuPaiements: recuPaiementsData
};

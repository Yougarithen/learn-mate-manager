
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

// Fonctions utilitaires pour la gestion des données

// Professeurs
export const getProfesseurs = (): Professeur[] => {
  return professeurs;
};

export const getProfesseurById = (id: string): Professeur | undefined => {
  return professeurs.find(prof => prof.id === id);
};

export const addProfesseur = (professeur: Omit<Professeur, "id">): Professeur => {
  const newProfesseur = { ...professeur, id: uuidv4() };
  (professeurs as Professeur[]).push(newProfesseur);
  return newProfesseur;
};

export const updateProfesseur = (id: string, professeur: Omit<Professeur, "id">): Professeur | undefined => {
  const index = professeurs.findIndex(prof => prof.id === id);
  if (index !== -1) {
    const updatedProfesseur = { ...professeur, id };
    (professeurs as Professeur[])[index] = updatedProfesseur;
    return updatedProfesseur;
  }
  return undefined;
};

export const deleteProfesseur = (id: string): boolean => {
  const index = professeurs.findIndex(prof => prof.id === id);
  if (index !== -1) {
    (professeurs as Professeur[]).splice(index, 1);
    return true;
  }
  return false;
};

// Élèves
export const getEleves = (): Eleve[] => {
  return eleves;
};

export const getEleveById = (id: string): Eleve | undefined => {
  return eleves.find(eleve => eleve.id === id);
};

// Cours
export const getCours = (): Cours[] => {
  return cours;
};

export const getCoursById = (id: string): Cours | undefined => {
  return cours.find(c => c.id === id);
};

// Salles
export const getSalles = (): Salle[] => {
  return salles;
};

export const getSalleById = (id: string): Salle | undefined => {
  return salles.find(salle => salle.id === id);
};

// Programmations
export const getProgrammations = (): Programmation[] => {
  return programmations;
};

export const getProgrammationsForProfesseur = (professeurId: string): Programmation[] => {
  return programmations.filter(prog => prog.professeurId === professeurId);
};

export const getProgrammationsForEleve = (eleveId: string): Programmation[] => {
  return programmations.filter(prog => prog.elevesIds.includes(eleveId));
};

// Fonction utilitaire pour générer une fiche de paie
export const genererFichePaie = (professeurId: string, mois: number, annee: number): FichePaie | undefined => {
  const professeur = getProfesseurById(professeurId);
  if (!professeur) return undefined;
  
  const debut = new Date(annee, mois - 1, 1);
  const fin = new Date(annee, mois, 0);
  
  const progsProfesseur = programmations.filter(prog => {
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
  
  const newPaiement = {
    id: uuidv4(),
    montant: totalSalaire,
    date: new Date().toISOString(),
    methode: "virement",
    reference: `PAIE-${professeur.nom}-${mois}-${annee}`
  };
  
  (paiements as Paiement[]).push(newPaiement);
  
  const fichePaie: FichePaie = {
    id: uuidv4(),
    professeurId,
    totalHeures,
    totalSalaire,
    date: new Date().toISOString(),
    programmationIds,
    paiementId: newPaiement.id
  };
  
  (fichePaies as FichePaie[]).push(fichePaie);
  
  return fichePaie;
};

// Export par défaut pour accès rapide
export default {
  professeurs,
  eleves,
  cours,
  salles,
  programmations,
  paiements,
  fichePaies,
  recuPaiements
};

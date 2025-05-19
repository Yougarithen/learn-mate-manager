
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialisation de l'application Express
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données SQLite
const dbPath = path.resolve(__dirname, './database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données SQLite', err.message);
  } else {
    console.log('Connecté à la base de données SQLite');
    initDatabase();
  }
});

// Initialisation de la base de données avec les tables
function initDatabase() {
  console.log('Initialisation de la base de données...');
  
  // Table Professeurs
  db.run(`CREATE TABLE IF NOT EXISTS professeurs (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT NOT NULL,
    diplome TEXT NOT NULL,
    specialite TEXT NOT NULL,
    status TEXT NOT NULL,
    adresse TEXT,
    biographie TEXT
  )`);

  // Table Eleves
  db.run(`CREATE TABLE IF NOT EXISTS eleves (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT NOT NULL,
    niveau TEXT NOT NULL,
    telParents TEXT NOT NULL,
    dateInscription TEXT NOT NULL,
    adresse TEXT,
    notes TEXT
  )`);

  // Table Cours
  db.run(`CREATE TABLE IF NOT EXISTS cours (
    id TEXT PRIMARY KEY,
    matiere TEXT NOT NULL,
    niveau TEXT NOT NULL,
    salaireParHeure REAL NOT NULL,
    description TEXT
  )`);

  // Table Salles
  db.run(`CREATE TABLE IF NOT EXISTS salles (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    capacite INTEGER NOT NULL,
    adresse TEXT,
    equipement TEXT,
    status TEXT NOT NULL
  )`);

  // Table Programmations
  db.run(`CREATE TABLE IF NOT EXISTS programmations (
    id TEXT PRIMARY KEY,
    coursId TEXT NOT NULL,
    professeurId TEXT NOT NULL,
    salleId TEXT NOT NULL,
    date TEXT NOT NULL,
    heure TEXT NOT NULL,
    duree INTEGER NOT NULL,
    FOREIGN KEY (coursId) REFERENCES cours (id),
    FOREIGN KEY (professeurId) REFERENCES professeurs (id),
    FOREIGN KEY (salleId) REFERENCES salles (id)
  )`);

  // Table Eleves_Programmations (relation many-to-many)
  db.run(`CREATE TABLE IF NOT EXISTS eleves_programmations (
    eleveId TEXT NOT NULL,
    programmationId TEXT NOT NULL,
    PRIMARY KEY (eleveId, programmationId),
    FOREIGN KEY (eleveId) REFERENCES eleves (id),
    FOREIGN KEY (programmationId) REFERENCES programmations (id)
  )`);

  // Table Paiements
  db.run(`CREATE TABLE IF NOT EXISTS paiements (
    id TEXT PRIMARY KEY,
    montant REAL NOT NULL,
    date TEXT NOT NULL,
    methode TEXT NOT NULL,
    reference TEXT NOT NULL
  )`);

  // Table FichePaies
  db.run(`CREATE TABLE IF NOT EXISTS fichePaies (
    id TEXT PRIMARY KEY,
    professeurId TEXT NOT NULL,
    totalHeures REAL NOT NULL,
    totalSalaire REAL NOT NULL,
    date TEXT NOT NULL,
    paiementId TEXT NOT NULL,
    FOREIGN KEY (professeurId) REFERENCES professeurs (id),
    FOREIGN KEY (paiementId) REFERENCES paiements (id)
  )`);

  // Table Programmations_FichePaies (relation many-to-many)
  db.run(`CREATE TABLE IF NOT EXISTS programmations_fichePaies (
    programmationId TEXT NOT NULL,
    fichePaieId TEXT NOT NULL,
    PRIMARY KEY (programmationId, fichePaieId),
    FOREIGN KEY (programmationId) REFERENCES programmations (id),
    FOREIGN KEY (fichePaieId) REFERENCES fichePaies (id)
  )`);

  // Table RecuPaiements
  db.run(`CREATE TABLE IF NOT EXISTS recuPaiements (
    id TEXT PRIMARY KEY,
    eleveId TEXT NOT NULL,
    paiementId TEXT NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY (eleveId) REFERENCES eleves (id),
    FOREIGN KEY (paiementId) REFERENCES paiements (id)
  )`);

  // Table Cours_RecuPaiements (relation many-to-many)
  db.run(`CREATE TABLE IF NOT EXISTS cours_recuPaiements (
    coursId TEXT NOT NULL,
    recuPaiementId TEXT NOT NULL,
    PRIMARY KEY (coursId, recuPaiementId),
    FOREIGN KEY (coursId) REFERENCES cours (id),
    FOREIGN KEY (recuPaiementId) REFERENCES recuPaiements (id)
  )`);
}

// Exportation de la connexion à la base de données pour les routes
module.exports.db = db;

// Importation des routes
const professeursRoutes = require('./routes/professeurs');
const elevesRoutes = require('./routes/eleves');
const coursRoutes = require('./routes/cours');
const sallesRoutes = require('./routes/salles');
const programmationsRoutes = require('./routes/programmations');
const paiementsRoutes = require('./routes/paiements');
const fichePaiesRoutes = require('./routes/fichePaies');
const recuPaiementsRoutes = require('./routes/recuPaiements');

// Utilisation des routes
app.use('/api/professeurs', professeursRoutes);
app.use('/api/eleves', elevesRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/salles', sallesRoutes);
app.use('/api/programmations', programmationsRoutes);
app.use('/api/paiements', paiementsRoutes);
app.use('/api/fichePaies', fichePaiesRoutes);
app.use('/api/recuPaiements', recuPaiementsRoutes);

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'API de gestion du centre de soutien scolaire' });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

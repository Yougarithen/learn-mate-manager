
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');
const paiementsController = require('./paiements');

// Récupérer toutes les fiches de paie
exports.getAllFichePaies = (req, res) => {
  db.all('SELECT * FROM fichePaies', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const promises = rows.map(row => {
      return new Promise((resolve, reject) => {
        db.all('SELECT programmationId FROM programmations_fichePaies WHERE fichePaieId = ?', [row.id], (err, progs) => {
          if (err) {
            reject(err);
            return;
          }
          row.programmationIds = progs.map(p => p.programmationId);
          resolve(row);
        });
      });
    });
    
    Promise.all(promises)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
};

// Récupérer une fiche de paie par son ID
exports.getFichePaieById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM fichePaies WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Fiche de paie non trouvée' });
    }
    
    db.all('SELECT programmationId FROM programmations_fichePaies WHERE fichePaieId = ?', [id], (err, progs) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      row.programmationIds = progs.map(p => p.programmationId);
      res.json(row);
    });
  });
};

// Récupérer les fiches de paie d'un professeur
exports.getFichePaiesForProfesseur = (req, res) => {
  const { professeurId } = req.params;
  
  db.all('SELECT * FROM fichePaies WHERE professeurId = ?', [professeurId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const promises = rows.map(row => {
      return new Promise((resolve, reject) => {
        db.all('SELECT programmationId FROM programmations_fichePaies WHERE fichePaieId = ?', [row.id], (err, progs) => {
          if (err) {
            reject(err);
            return;
          }
          row.programmationIds = progs.map(p => p.programmationId);
          resolve(row);
        });
      });
    });
    
    Promise.all(promises)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
};

// Créer une nouvelle fiche de paie
exports.createFichePaie = (req, res) => {
  const { professeurId, totalHeures, totalSalaire, date, programmationIds } = req.body;
  
  if (!professeurId || !totalHeures || !totalSalaire || !date || !programmationIds) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  // Créer d'abord un paiement
  const paiementReq = {
    body: {
      montant: totalSalaire,
      date: date,
      methode: "virement",
      reference: `PAIE-${professeurId}-${Date.now()}`
    }
  };
  
  const paiementRes = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.data = data;
      
      // Continuer avec la création de la fiche de paie
      if (this.statusCode === 201) {
        const paiementId = data.id;
        const id = uuidv4();
        
        db.serialize(() => {
          db.run('BEGIN TRANSACTION');
          
          db.run(
            'INSERT INTO fichePaies (id, professeurId, totalHeures, totalSalaire, date, paiementId) VALUES (?, ?, ?, ?, ?, ?)',
            [id, professeurId, totalHeures, totalSalaire, date, paiementId],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
              
              // Ajouter les programmations à la relation many-to-many
              const stmt = db.prepare('INSERT INTO programmations_fichePaies (programmationId, fichePaieId) VALUES (?, ?)');
              
              programmationIds.forEach(progId => {
                stmt.run([progId, id], (err) => {
                  if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: err.message });
                  }
                });
              });
              
              stmt.finalize();
              
              db.run('COMMIT', (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: err.message });
                }
                
                db.get('SELECT * FROM fichePaies WHERE id = ?', [id], (err, row) => {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }
                  
                  db.all('SELECT programmationId FROM programmations_fichePaies WHERE fichePaieId = ?', [id], (err, progs) => {
                    if (err) {
                      return res.status(500).json({ error: err.message });
                    }
                    
                    row.programmationIds = progs.map(p => p.programmationId);
                    res.status(201).json(row);
                  });
                });
              });
            }
          );
        });
      } else {
        // Erreur lors de la création du paiement
        res.status(500).json({ error: 'Erreur lors de la création du paiement' });
      }
    }
  };
  
  paiementsController.createPaiement(paiementReq, paiementRes);
};

// Générer une fiche de paie pour un professeur
exports.genererFichePaie = (req, res) => {
  const { professeurId } = req.params;
  const { mois, annee } = req.body;
  
  if (!mois || !annee) {
    return res.status(400).json({ error: 'Le mois et l\'année sont requis' });
  }
  
  const debut = new Date(annee, mois - 1, 1);
  const fin = new Date(annee, mois, 0);
  
  const debutStr = debut.toISOString().split('T')[0];
  const finStr = fin.toISOString().split('T')[0];
  
  // Récupérer toutes les programmations du professeur dans le mois spécifié
  db.all(
    'SELECT * FROM programmations WHERE professeurId = ? AND date >= ? AND date <= ?',
    [professeurId, debutStr, finStr],
    (err, programmations) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (programmations.length === 0) {
        return res.status(404).json({ error: 'Aucune programmation trouvée pour ce mois' });
      }
      
      // Calculer le total des heures
      let totalHeures = 0;
      const programmationIds = [];
      
      programmations.forEach(prog => {
        totalHeures += prog.duree / 60; // Convertir minutes en heures
        programmationIds.push(prog.id);
      });
      
      // On suppose que tous les cours ont le même taux horaire pour simplifier
      db.get(
        'SELECT salaireParHeure FROM cours WHERE id = (SELECT coursId FROM programmations WHERE professeurId = ? LIMIT 1)',
        [professeurId],
        (err, cours) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          const tauxHoraire = cours ? cours.salaireParHeure : 25;
          const totalSalaire = totalHeures * tauxHoraire;
          
          // Créer la fiche de paie
          const fichePaieReq = {
            body: {
              professeurId,
              totalHeures,
              totalSalaire,
              date: new Date().toISOString(),
              programmationIds
            }
          };
          
          exports.createFichePaie(fichePaieReq, res);
        }
      );
    }
  );
};

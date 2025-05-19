
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');
const paiementsController = require('./paiements');

// Récupérer tous les reçus de paiements
exports.getAllRecuPaiements = (req, res) => {
  db.all('SELECT * FROM recuPaiements', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const promises = rows.map(row => {
      return new Promise((resolve, reject) => {
        db.all('SELECT coursId FROM cours_recuPaiements WHERE recuPaiementId = ?', [row.id], (err, cours) => {
          if (err) {
            reject(err);
            return;
          }
          row.coursIds = cours.map(c => c.coursId);
          resolve(row);
        });
      });
    });
    
    Promise.all(promises)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
};

// Récupérer un reçu de paiement par son ID
exports.getRecuPaiementById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM recuPaiements WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Reçu de paiement non trouvé' });
    }
    
    db.all('SELECT coursId FROM cours_recuPaiements WHERE recuPaiementId = ?', [id], (err, cours) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      row.coursIds = cours.map(c => c.coursId);
      res.json(row);
    });
  });
};

// Récupérer les reçus de paiement pour un élève
exports.getRecuPaiementsForEleve = (req, res) => {
  const { eleveId } = req.params;
  
  db.all('SELECT * FROM recuPaiements WHERE eleveId = ?', [eleveId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const promises = rows.map(row => {
      return new Promise((resolve, reject) => {
        db.all('SELECT coursId FROM cours_recuPaiements WHERE recuPaiementId = ?', [row.id], (err, cours) => {
          if (err) {
            reject(err);
            return;
          }
          row.coursIds = cours.map(c => c.coursId);
          resolve(row);
        });
      });
    });
    
    Promise.all(promises)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
};

// Créer un nouveau reçu de paiement
exports.createRecuPaiement = (req, res) => {
  const { eleveId, coursIds, montant, methode, reference, date } = req.body;
  
  if (!eleveId || !coursIds || !montant || !methode || !date) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  // Créer d'abord un paiement
  const paiementReq = {
    body: {
      montant: montant,
      date: date,
      methode: methode,
      reference: reference || `RECU-${eleveId.substr(0, 8)}-${Date.now()}`
    }
  };
  
  const paiementRes = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.data = data;
      
      // Continuer avec la création du reçu de paiement
      if (this.statusCode === 201) {
        const paiementId = data.id;
        const id = uuidv4();
        
        db.serialize(() => {
          db.run('BEGIN TRANSACTION');
          
          db.run(
            'INSERT INTO recuPaiements (id, eleveId, paiementId, date) VALUES (?, ?, ?, ?)',
            [id, eleveId, paiementId, date],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
              
              // Ajouter les cours à la relation many-to-many
              const stmt = db.prepare('INSERT INTO cours_recuPaiements (coursId, recuPaiementId) VALUES (?, ?)');
              
              coursIds.forEach(coursId => {
                stmt.run([coursId, id], (err) => {
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
                
                db.get('SELECT * FROM recuPaiements WHERE id = ?', [id], (err, row) => {
                  if (err) {
                    return res.status(500).json({ error: err.message });
                  }
                  
                  db.all('SELECT coursId FROM cours_recuPaiements WHERE recuPaiementId = ?', [id], (err, cours) => {
                    if (err) {
                      return res.status(500).json({ error: err.message });
                    }
                    
                    row.coursIds = cours.map(c => c.coursId);
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


const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');

// Récupérer toutes les programmations
exports.getAllProgrammations = (req, res) => {
  db.all('SELECT * FROM programmations', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const promises = rows.map(row => {
      return new Promise((resolve, reject) => {
        db.all('SELECT eleveId FROM eleves_programmations WHERE programmationId = ?', [row.id], (err, eleves) => {
          if (err) {
            reject(err);
            return;
          }
          row.elevesIds = eleves.map(e => e.eleveId);
          resolve(row);
        });
      });
    });
    
    Promise.all(promises)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
};

// Récupérer une programmation par son ID
exports.getProgrammationById = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM programmations WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Programmation non trouvée' });
    }
    
    db.all('SELECT eleveId FROM eleves_programmations WHERE programmationId = ?', [id], (err, eleves) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      row.elevesIds = eleves.map(e => e.eleveId);
      res.json(row);
    });
  });
};

// Créer une nouvelle programmation
exports.createProgrammation = (req, res) => {
  const { coursId, professeurId, salleId, date, heure, duree, elevesIds } = req.body;
  
  if (!coursId || !professeurId || !salleId || !date || !heure || !duree) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  const id = uuidv4();
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.run(
      'INSERT INTO programmations (id, coursId, professeurId, salleId, date, heure, duree) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, coursId, professeurId, salleId, date, heure, duree],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        // Si des élèves sont fournis, les ajouter à la relation many-to-many
        if (elevesIds && elevesIds.length > 0) {
          const stmt = db.prepare('INSERT INTO eleves_programmations (eleveId, programmationId) VALUES (?, ?)');
          
          elevesIds.forEach(eleveId => {
            stmt.run([eleveId, id], (err) => {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
            });
          });
          
          stmt.finalize();
        }
        
        db.run('COMMIT', (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          // Récupérer la programmation créée avec ses élèves
          exports.getProgrammationById(req, res);
        });
      }
    );
  });
};

// Mettre à jour une programmation
exports.updateProgrammation = (req, res) => {
  const { id } = req.params;
  const { coursId, professeurId, salleId, date, heure, duree, elevesIds } = req.body;
  
  if (!coursId || !professeurId || !salleId || !date || !heure || !duree) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    db.run(
      'UPDATE programmations SET coursId = ?, professeurId = ?, salleId = ?, date = ?, heure = ?, duree = ? WHERE id = ?',
      [coursId, professeurId, salleId, date, heure, duree, id],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        if (this.changes === 0) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Programmation non trouvée' });
        }
        
        // Supprimer les anciennes relations avec les élèves
        db.run('DELETE FROM eleves_programmations WHERE programmationId = ?', [id], (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          // Si des élèves sont fournis, les ajouter à la relation many-to-many
          if (elevesIds && elevesIds.length > 0) {
            const stmt = db.prepare('INSERT INTO eleves_programmations (eleveId, programmationId) VALUES (?, ?)');
            
            elevesIds.forEach(eleveId => {
              stmt.run([eleveId, id], (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: err.message });
                }
              });
            });
            
            stmt.finalize();
          }
          
          db.run('COMMIT', (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: err.message });
            }
            
            // Récupérer la programmation mise à jour avec ses élèves
            exports.getProgrammationById(req, res);
          });
        });
      }
    );
  });
};

// Supprimer une programmation
exports.deleteProgrammation = (req, res) => {
  const { id } = req.params;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Supprimer d'abord les relations avec les élèves
    db.run('DELETE FROM eleves_programmations WHERE programmationId = ?', [id], (err) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: err.message });
      }
      
      // Ensuite supprimer la programmation elle-même
      db.run('DELETE FROM programmations WHERE id = ?', [id], function(err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }
        
        if (this.changes === 0) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Programmation non trouvée' });
        }
        
        db.run('COMMIT', (err) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          res.json({ message: 'Programmation supprimée avec succès' });
        });
      });
    });
  });
};

// Récupérer les programmations pour un professeur
exports.getProgrammationsForProfesseur = (req, res) => {
  const { professeurId } = req.params;
  
  db.all('SELECT * FROM programmations WHERE professeurId = ?', [professeurId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const promises = rows.map(row => {
      return new Promise((resolve, reject) => {
        db.all('SELECT eleveId FROM eleves_programmations WHERE programmationId = ?', [row.id], (err, eleves) => {
          if (err) {
            reject(err);
            return;
          }
          row.elevesIds = eleves.map(e => e.eleveId);
          resolve(row);
        });
      });
    });
    
    Promise.all(promises)
      .then(results => res.json(results))
      .catch(err => res.status(500).json({ error: err.message }));
  });
};

// Ajouter un élève à une programmation
exports.addEleveToProgrammation = (req, res) => {
  const { id, eleveId } = req.params;
  
  db.get('SELECT * FROM programmations WHERE id = ?', [id], (err, programmation) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!programmation) {
      return res.status(404).json({ error: 'Programmation non trouvée' });
    }
    
    db.get('SELECT * FROM eleves WHERE id = ?', [eleveId], (err, eleve) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (!eleve) {
        return res.status(404).json({ error: 'Élève non trouvé' });
      }
      
      db.run('INSERT INTO eleves_programmations (eleveId, programmationId) VALUES (?, ?)', [eleveId, id], function(err) {
        if (err) {
          // Si l'erreur est due à une contrainte d'unicité, l'élève est déjà inscrit
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'L\'élève est déjà inscrit à cette programmation' });
          }
          return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'Élève ajouté à la programmation avec succès' });
      });
    });
  });
};

// Retirer un élève d'une programmation
exports.removeEleveFromProgrammation = (req, res) => {
  const { id, eleveId } = req.params;
  
  db.run('DELETE FROM eleves_programmations WHERE eleveId = ? AND programmationId = ?', [eleveId, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'L\'élève n\'est pas inscrit à cette programmation' });
    }
    
    res.json({ message: 'Élève retiré de la programmation avec succès' });
  });
};

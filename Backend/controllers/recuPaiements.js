
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');

// Récupérer tous les reçus de paiement
exports.getAllRecuPaiements = (req, res) => {
  db.all('SELECT * FROM recuPaiements', [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des reçus de paiement:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Récupérer un reçu de paiement par son ID
exports.getRecuPaiementById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM recuPaiements WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération du reçu de paiement:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Reçu de paiement non trouvé' });
    }
    res.json(row);
  });
};

// Récupérer les reçus de paiement d'un élève
exports.getRecuPaiementsForEleve = (req, res) => {
  const { eleveId } = req.params;
  db.all('SELECT * FROM recuPaiements WHERE eleveId = ?', [eleveId], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des reçus de paiement de l\'élève:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Créer un nouveau reçu de paiement
exports.createRecuPaiement = (req, res) => {
  const { eleveId, coursIds, montant, methode, reference, date } = req.body;
  
  if (!eleveId || !coursIds || !montant || !methode || !date) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  // Commencer une transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    try {
      // Créer d'abord un nouveau paiement
      const paiementId = uuidv4();
      const ref = reference || `REF-${Date.now()}`;
      
      db.run(
        'INSERT INTO paiements (id, montant, date, methode, reference) VALUES (?, ?, ?, ?, ?)',
        [paiementId, montant, date, methode, ref],
        function(err) {
          if (err) {
            console.error('Erreur lors de la création du paiement:', err.message);
            db.run('ROLLBACK');
            return res.status(500).json({ error: err.message });
          }
          
          // Créer ensuite le reçu de paiement
          const recuId = uuidv4();
          db.run(
            'INSERT INTO recuPaiements (id, eleveId, paiementId, date) VALUES (?, ?, ?, ?)',
            [recuId, eleveId, paiementId, date],
            function(err) {
              if (err) {
                console.error('Erreur lors de la création du reçu de paiement:', err.message);
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
              }
              
              // Associer les cours au reçu de paiement
              let coursInserted = 0;
              
              if (coursIds.length === 0) {
                db.run('COMMIT');
                return res.status(201).json({
                  id: recuId,
                  eleveId,
                  paiementId,
                  date,
                  coursIds: [],
                  reference: ref
                });
              }
              
              coursIds.forEach(coursId => {
                db.run(
                  'INSERT INTO cours_recuPaiements (coursId, recuPaiementId) VALUES (?, ?)',
                  [coursId, recuId],
                  function(err) {
                    if (err) {
                      console.error('Erreur lors de l\'association du cours au reçu:', err.message);
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: err.message });
                    }
                    
                    coursInserted++;
                    
                    if (coursInserted === coursIds.length) {
                      db.run('COMMIT');
                      res.status(201).json({
                        id: recuId,
                        eleveId,
                        paiementId,
                        date,
                        coursIds,
                        reference: ref
                      });
                    }
                  }
                );
              });
            }
          );
        }
      );
    } catch (error) {
      console.error('Erreur lors de la création du reçu:', error.message);
      db.run('ROLLBACK');
      res.status(500).json({ error: error.message });
    }
  });
};

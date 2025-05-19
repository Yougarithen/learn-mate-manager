
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');

// Récupérer tous les paiements
exports.getAllPaiements = (req, res) => {
  db.all('SELECT * FROM paiements', [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des paiements:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Récupérer un paiement par son ID
exports.getPaiementById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM paiements WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération du paiement:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }
    res.json(row);
  });
};

// Créer un nouveau paiement
exports.createPaiement = (req, res) => {
  const { montant, date, methode, reference } = req.body;
  
  if (!montant || !date || !methode) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  const id = uuidv4();
  const ref = reference || `REF-${Date.now()}`;
  
  db.run(
    'INSERT INTO paiements (id, montant, date, methode, reference) VALUES (?, ?, ?, ?, ?)',
    [id, montant, date, methode, ref],
    function(err) {
      if (err) {
        console.error('Erreur lors de la création du paiement:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      db.get('SELECT * FROM paiements WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Erreur lors de la récupération du nouveau paiement:', err.message);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
};

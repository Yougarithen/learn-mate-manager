
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');

// Récupérer toutes les salles
exports.getAllSalles = (req, res) => {
  db.all('SELECT * FROM salles', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Récupérer une salle par son ID
exports.getSalleById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM salles WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Salle non trouvée' });
    }
    res.json(row);
  });
};

// Créer une nouvelle salle
exports.createSalle = (req, res) => {
  const { nom, capacite, adresse, equipement, status } = req.body;
  
  if (!nom || !capacite || !status) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  const id = uuidv4();
  
  db.run(
    'INSERT INTO salles (id, nom, capacite, adresse, equipement, status) VALUES (?, ?, ?, ?, ?, ?)',
    [id, nom, capacite, adresse, equipement, status],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      db.get('SELECT * FROM salles WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
};

// Mettre à jour une salle
exports.updateSalle = (req, res) => {
  const { id } = req.params;
  const { nom, capacite, adresse, equipement, status } = req.body;
  
  if (!nom || !capacite || !status) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  db.run(
    'UPDATE salles SET nom = ?, capacite = ?, adresse = ?, equipement = ?, status = ? WHERE id = ?',
    [nom, capacite, adresse, equipement, status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Salle non trouvée' });
      }
      
      db.get('SELECT * FROM salles WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      });
    }
  );
};

// Supprimer une salle
exports.deleteSalle = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM salles WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Salle non trouvée' });
    }
    
    res.json({ message: 'Salle supprimée avec succès' });
  });
};

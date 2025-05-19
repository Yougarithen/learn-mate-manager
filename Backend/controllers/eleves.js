
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');

// Récupérer tous les élèves
exports.getAllEleves = (req, res) => {
  db.all('SELECT * FROM eleves', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Récupérer un élève par son ID
exports.getEleveById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM eleves WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }
    res.json(row);
  });
};

// Créer un nouvel élève
exports.createEleve = (req, res) => {
  const { nom, prenom, email, telephone, niveau, telParents, dateInscription, adresse, notes } = req.body;
  
  if (!nom || !prenom || !email || !telephone || !niveau || !telParents || !dateInscription) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  const id = uuidv4();
  
  db.run(
    'INSERT INTO eleves (id, nom, prenom, email, telephone, niveau, telParents, dateInscription, adresse, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, nom, prenom, email, telephone, niveau, telParents, dateInscription, adresse, notes],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      db.get('SELECT * FROM eleves WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
};

// Mettre à jour un élève
exports.updateEleve = (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, telephone, niveau, telParents, dateInscription, adresse, notes } = req.body;
  
  if (!nom || !prenom || !email || !telephone || !niveau || !telParents || !dateInscription) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  db.run(
    'UPDATE eleves SET nom = ?, prenom = ?, email = ?, telephone = ?, niveau = ?, telParents = ?, dateInscription = ?, adresse = ?, notes = ? WHERE id = ?',
    [nom, prenom, email, telephone, niveau, telParents, dateInscription, adresse, notes, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Élève non trouvé' });
      }
      
      db.get('SELECT * FROM eleves WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      });
    }
  );
};

// Supprimer un élève
exports.deleteEleve = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM eleves WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Élève non trouvé' });
    }
    
    res.json({ message: 'Élève supprimé avec succès' });
  });
};

// Récupérer les programmations d'un élève
exports.getEleveProgrammations = (req, res) => {
  const { id } = req.params;
  
  db.all(`
    SELECT p.* FROM programmations p
    JOIN eleves_programmations ep ON p.id = ep.programmationId
    WHERE ep.eleveId = ?
  `, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

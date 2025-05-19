
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');

// Récupérer tous les professeurs
exports.getAllProfesseurs = (req, res) => {
  db.all('SELECT * FROM professeurs', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Récupérer un professeur par son ID
exports.getProfesseurById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM professeurs WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }
    res.json(row);
  });
};

// Créer un nouveau professeur
exports.createProfesseur = (req, res) => {
  const { nom, prenom, email, telephone, diplome, specialite, status, adresse, biographie } = req.body;
  
  if (!nom || !prenom || !email || !telephone || !diplome || !specialite || !status) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  const id = uuidv4();
  
  db.run(
    'INSERT INTO professeurs (id, nom, prenom, email, telephone, diplome, specialite, status, adresse, biographie) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, nom, prenom, email, telephone, diplome, specialite, status, adresse, biographie],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      db.get('SELECT * FROM professeurs WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
};

// Mettre à jour un professeur
exports.updateProfesseur = (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email, telephone, diplome, specialite, status, adresse, biographie } = req.body;
  
  if (!nom || !prenom || !email || !telephone || !diplome || !specialite || !status) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  db.run(
    'UPDATE professeurs SET nom = ?, prenom = ?, email = ?, telephone = ?, diplome = ?, specialite = ?, status = ?, adresse = ?, biographie = ? WHERE id = ?',
    [nom, prenom, email, telephone, diplome, specialite, status, adresse, biographie, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Professeur non trouvé' });
      }
      
      db.get('SELECT * FROM professeurs WHERE id = ?', [id], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      });
    }
  );
};

// Supprimer un professeur
exports.deleteProfesseur = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM professeurs WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }
    
    res.json({ message: 'Professeur supprimé avec succès' });
  });
};

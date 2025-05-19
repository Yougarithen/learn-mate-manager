
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');

// Récupérer tous les cours
exports.getAllCours = (req, res) => {
  db.all('SELECT * FROM cours', [], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des cours:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Récupérer un cours par son ID
exports.getCoursById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM cours WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Erreur lors de la récupération du cours:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    res.json(row);
  });
};

// Récupérer les cours d'un élève
exports.getEleveCours = (req, res) => {
  const { eleveId } = req.params;
  
  const sql = `
    SELECT c.* FROM cours c
    JOIN cours_recuPaiements crp ON c.id = crp.coursId
    JOIN recuPaiements rp ON crp.recuPaiementId = rp.id
    WHERE rp.eleveId = ?
    UNION
    SELECT c.* FROM cours c
    JOIN programmations p ON c.id = p.coursId
    JOIN eleves_programmations ep ON p.id = ep.programmationId
    WHERE ep.eleveId = ?
  `;
  
  db.all(sql, [eleveId, eleveId], (err, rows) => {
    if (err) {
      console.error('Erreur lors de la récupération des cours de l\'élève:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Créer un nouveau cours
exports.createCours = (req, res) => {
  const { matiere, niveau, salaireParHeure, description } = req.body;
  
  if (!matiere || !niveau || !salaireParHeure) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  const id = uuidv4();
  
  db.run(
    'INSERT INTO cours (id, matiere, niveau, salaireParHeure, description) VALUES (?, ?, ?, ?, ?)',
    [id, matiere, niveau, salaireParHeure, description],
    function(err) {
      if (err) {
        console.error('Erreur lors de la création du cours:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      db.get('SELECT * FROM cours WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Erreur lors de la récupération du nouveau cours:', err.message);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
};

// Mettre à jour un cours
exports.updateCours = (req, res) => {
  const { id } = req.params;
  const { matiere, niveau, salaireParHeure, description } = req.body;
  
  if (!matiere || !niveau || !salaireParHeure) {
    return res.status(400).json({ error: 'Tous les champs requis doivent être fournis' });
  }
  
  db.run(
    'UPDATE cours SET matiere = ?, niveau = ?, salaireParHeure = ?, description = ? WHERE id = ?',
    [matiere, niveau, salaireParHeure, description, id],
    function(err) {
      if (err) {
        console.error('Erreur lors de la mise à jour du cours:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Cours non trouvé' });
      }
      
      db.get('SELECT * FROM cours WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Erreur lors de la récupération du cours mis à jour:', err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json(row);
      });
    }
  );
};

// Supprimer un cours
exports.deleteCours = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM cours WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erreur lors de la suppression du cours:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cours non trouvé' });
    }
    
    res.json({ message: 'Cours supprimé avec succès' });
  });
};

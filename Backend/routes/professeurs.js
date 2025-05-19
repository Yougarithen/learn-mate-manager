
const express = require('express');
const router = express.Router();
const professeursController = require('../controllers/professeurs');

// Routes pour les professeurs
router.get('/', professeursController.getAllProfesseurs);
router.get('/:id', professeursController.getProfesseurById);
router.post('/', professeursController.createProfesseur);
router.put('/:id', professeursController.updateProfesseur);
router.delete('/:id', professeursController.deleteProfesseur);

module.exports = router;

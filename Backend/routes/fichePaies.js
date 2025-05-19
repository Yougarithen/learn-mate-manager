
const express = require('express');
const router = express.Router();
const fichePaiesController = require('../controllers/fichePaies');

// Routes pour les fiches de paie
router.get('/', fichePaiesController.getAllFichePaies);
router.get('/:id', fichePaiesController.getFichePaieById);
router.get('/professeur/:professeurId', fichePaiesController.getFichePaiesForProfesseur);
router.post('/', fichePaiesController.createFichePaie);
router.post('/generer/:professeurId', fichePaiesController.genererFichePaie);

module.exports = router;

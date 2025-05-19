
const express = require('express');
const router = express.Router();
const recuPaiementsController = require('../controllers/recuPaiements');

// Routes pour les reçus de paiement
router.get('/', recuPaiementsController.getAllRecuPaiements);
router.get('/:id', recuPaiementsController.getRecuPaiementById);
router.get('/eleve/:eleveId', recuPaiementsController.getRecuPaiementsForEleve);
router.post('/', recuPaiementsController.createRecuPaiement);

module.exports = router;


const express = require('express');
const router = express.Router();
const paiementsController = require('../controllers/paiements');

// Routes pour les paiements
router.get('/', paiementsController.getAllPaiements);
router.get('/:id', paiementsController.getPaiementById);
router.post('/', paiementsController.createPaiement);

module.exports = router;

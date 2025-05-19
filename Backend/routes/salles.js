
const express = require('express');
const router = express.Router();
const sallesController = require('../controllers/salles');

// Routes pour les salles
router.get('/', sallesController.getAllSalles);
router.get('/:id', sallesController.getSalleById);
router.post('/', sallesController.createSalle);
router.put('/:id', sallesController.updateSalle);
router.delete('/:id', sallesController.deleteSalle);

module.exports = router;

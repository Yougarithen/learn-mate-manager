
const express = require('express');
const router = express.Router();
const programmationsController = require('../controllers/programmations');

// Routes pour les programmations
router.get('/', programmationsController.getAllProgrammations);
router.get('/:id', programmationsController.getProgrammationById);
router.get('/professeur/:professeurId', programmationsController.getProgrammationsForProfesseur);
router.post('/', programmationsController.createProgrammation);
router.put('/:id', programmationsController.updateProgrammation);
router.delete('/:id', programmationsController.deleteProgrammation);
router.post('/:id/eleves/:eleveId', programmationsController.addEleveToProgrammation);
router.delete('/:id/eleves/:eleveId', programmationsController.removeEleveFromProgrammation);

module.exports = router;


const express = require('express');
const router = express.Router();
const elevesController = require('../controllers/eleves');

// Routes pour les élèves
router.get('/', elevesController.getAllEleves);
router.get('/:id', elevesController.getEleveById);
router.get('/:id/programmations', elevesController.getEleveProgrammations);
router.post('/', elevesController.createEleve);
router.put('/:id', elevesController.updateEleve);
router.delete('/:id', elevesController.deleteEleve);

module.exports = router;


const express = require('express');
const router = express.Router();
const coursController = require('../controllers/cours');

// Routes pour les cours
router.get('/', coursController.getAllCours);
router.get('/:id', coursController.getCoursById);
router.get('/eleve/:eleveId', coursController.getEleveCours);
router.post('/', coursController.createCours);
router.put('/:id', coursController.updateCours);
router.delete('/:id', coursController.deleteCours);

module.exports = router;

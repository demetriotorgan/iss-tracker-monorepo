const express = require('express');
const { createPosition, getOrbits, getCurrentOrbit, resetOrbits, healthCheck } = require('../controllers/issController');

const router = express.Router();

router.post('/position', createPosition);
router.get('/orbits', getOrbits);
router.get('/orbits/active', getCurrentOrbit);
router.delete('/orbits', resetOrbits);
router.get('/health', healthCheck);

module.exports = router;
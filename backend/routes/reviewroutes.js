const express = require('express');
const reviewController = require('../controllers/reviewcontroller');

const router = express.Router();

// Rutas - sin /reviews porque ya está en app.js
router.get('/', reviewController.getallreviews);
router.get('/:id', reviewController.getreviewbyid);
router.post('/', reviewController.createreview);
router.delete('/:id', reviewController.deletereview);

// Rutas adicionales si las necesitas
router.get('/rating/:rating', reviewController.getreviewsbyrating);
router.get('/stats/all', reviewController.getreviewstats);
router.put('/:id', reviewController.updatereview);

module.exports = router;
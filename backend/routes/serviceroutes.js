const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const serviceController = require('../controllers/servicecontroller');

// Usar single para una sola foto
router.get('/', serviceController.getallservices);
router.get('/:id', serviceController.getservicebyid);
router.get('/stats/all', serviceController.getservicestats);

// Rutas protegidas (admin) - usando single('foto')
router.post('/', upload.single('foto'), serviceController.createservice);
router.put('/:id', upload.single('foto'), serviceController.updateservice);
router.delete('/:id', serviceController.deleteservice);

module.exports = router;
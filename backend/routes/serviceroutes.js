const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const serviceController = require('../controllers/servicecontroller');

// Configurar campos para múltiples archivos
const uploadFields = upload.fields([
    { name: 'fotoantes', maxCount: 1 },
    { name: 'fotodespues', maxCount: 1 }
]);

// Rutas públicas (sin /services porque ya está en app.js)
router.get('/', serviceController.getallservices);
router.get('/:id', serviceController.getservicebyid);
router.get('/stats/all', serviceController.getservicestats);

// Rutas protegidas (admin)
router.post('/', uploadFields, serviceController.createservice);
router.put('/:id', uploadFields, serviceController.updateservice);
router.delete('/:id', serviceController.deleteservice);

module.exports = router;
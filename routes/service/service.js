const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); 
const serviceController = require('../../controllers/serviceController/serviceController');

// Service CRUD routes
router.post('/', upload.single('image'), serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', upload.single('image'), serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
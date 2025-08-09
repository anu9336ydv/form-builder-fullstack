const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Form management routes
router.post('/', formController.createForm);
router.put('/:id', formController.updateForm);
router.get('/:id', formController.getForm);
router.post('/upload-image', upload.single('image'), formController.uploadImage);

// Form submission routes
router.get('/:id/submissions', formController.getSubmissions);
router.post('/:id/submit', formController.submitForm);

module.exports = router;

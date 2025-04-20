const express = require('express');
const router = express.Router();

// Controller requirements
const { documentation, setupDocumentation } = require('../../controllers/docController');

// Route to serve the Swagger documentation
router.use('/', documentation, setupDocumentation);

module.exports = router;

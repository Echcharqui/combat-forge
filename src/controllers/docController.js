const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Load the Swagger YAML file
const swaggerDocument = YAML.load(path.join(__dirname, '../documentation/swagger.yaml'));

// Middleware to serve Swagger UI
const documentation = swaggerUi.serve;
const setupDocumentation = swaggerUi.setup(swaggerDocument);

// Export Swagger UI route handlers
module.exports = { documentation, setupDocumentation };

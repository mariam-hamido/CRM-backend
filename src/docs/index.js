const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./swagger.config");

module.exports = {
  swaggerSpec,
  swaggerUi,
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "CRM Backend API Documentation",
    customCss: ".swagger-ui .topbar { display: none }",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }),
};

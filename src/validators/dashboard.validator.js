const { query } = require("express-validator");
const { handleValidationErrors } = require("./auth.validator");

const validateDashboardQuery = [
  query("pipelineId")
    .optional()
    .isMongoId()
    .withMessage("pipelineId must be a valid MongoDB ObjectId"),
  query("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("assignedTo must be a valid MongoDB ObjectId"),
  query("organizer")
    .optional()
    .isMongoId()
    .withMessage("organizer must be a valid MongoDB ObjectId"),
  query("from")
    .optional()
    .isISO8601()
    .withMessage("from must be a valid ISO date"),
  query("to")
    .optional()
    .isISO8601()
    .withMessage("to must be a valid ISO date"),
  query("from").custom((value, { req }) => {
    if (value && req.query.to && new Date(value) > new Date(req.query.to)) {
      throw new Error("from must be before to");
    }

    return true;
  }),
];

module.exports = { validateDashboardQuery, handleValidationErrors };

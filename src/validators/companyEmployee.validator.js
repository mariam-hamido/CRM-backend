const { param, query } = require("express-validator");
const { handleValidationErrors } = require("./auth.validator");

// Employee id must be a well-formed ObjectId; malformed ids are rejected
// before they can reach Mongoose and leak CastError internals.
const validateEmployeeId = [
  param("id").isMongoId().withMessage("Employee id must be a valid id"),
  handleValidationErrors,
];

// Optional list filters mirror the invitation list conventions.
const validateListEmployees = [
  query("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
  handleValidationErrors,
];

module.exports = { validateEmployeeId, validateListEmployees };

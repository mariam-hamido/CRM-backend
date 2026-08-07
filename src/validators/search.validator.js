const { query } = require("express-validator");
const { handleValidationErrors } = require("./auth.validator");

const validateSearchQuery = [
  query("q")
    .exists()
    .withMessage("Search query is required")
    .isString()
    .withMessage("Search query must be a string")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters"),
];

module.exports = { validateSearchQuery, handleValidationErrors };

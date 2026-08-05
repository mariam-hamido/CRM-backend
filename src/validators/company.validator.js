const { body } = require("express-validator");

const validateCreateCompany = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters")
    .isString()
    .withMessage("Company name must be a string"),
  body("industry")
    .optional()
    .trim()
    .isString()
    .withMessage("Industry must be a string"),
  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("A valid website URL is required"),
  body("phone")
    .optional()
    .trim()
    .isString()
    .withMessage("Phone must be a string"),
  body("email")
    .optional()
    .normalizeEmail()
    .isEmail()
    .withMessage("A valid email is required"),
  body("country")
    .optional()
    .trim()
    .isString()
    .withMessage("Country must be a string"),
  body("city")
    .optional()
    .trim()
    .isString()
    .withMessage("City must be a string"),
  body("address")
    .optional()
    .trim()
    .isString()
    .withMessage("Address must be a string"),
  body("subscriptionPlan")
    .optional()
    .isIn(["free", "starter", "professional", "enterprise"])
    .withMessage(
      "Subscription plan must be one of: free, starter, professional, enterprise"
    ),
];

module.exports = { validateCreateCompany };

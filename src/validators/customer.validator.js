const { body } = require("express-validator");
const { handleValidationErrors } = require("./auth.validator");

const validateCustomer = [
  body("companyName")
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
  body("email")
    .optional()
    .normalizeEmail()
    .isEmail()
    .withMessage("A valid email is required"),
  body("phone")
    .optional()
    .trim()
    .isString()
    .withMessage("Phone must be a string"),
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
  body("status")
    .optional()
    .isIn(["active", "inactive", "prospect"])
    .withMessage("Status must be one of: active, inactive, prospect"),
  body("source")
    .optional()
    .isIn([
      "website",
      "referral",
      "social_media",
      "cold_call",
      "email",
      "advertisement",
      "other",
    ])
    .withMessage(
      "Source must be one of: website, referral, social_media, cold_call, email, advertisement, other"
    ),
  body("annualRevenue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Annual revenue must be a positive number"),
  body("employeesCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Employees count must be a positive integer"),
  body("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("isDeleted must be a boolean"),
];

module.exports = { validateCustomer, handleValidationErrors };

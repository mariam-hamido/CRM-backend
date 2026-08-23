const { body, validationResult } = require("express-validator");

// Shared identity rules reused by legacy register and employee register.
const firstNameRules = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .isString()
    .withMessage("First name must be a string"),
];

const lastNameRules = [
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .isString()
    .withMessage("Last name must be a string"),
];

const emailRules = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("A valid email is required"),
];

const passwordRules = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
];

// LEGACY REGISTER - company stays a MongoDB ObjectId (unchanged contract).
const validateRegister = [
  ...firstNameRules,
  ...lastNameRules,
  ...emailRules,
  ...passwordRules,
  body("company")
    .notEmpty()
    .withMessage("Company is required")
    .isMongoId()
    .withMessage("Company must be a valid MongoDB ObjectId"),
];

// EMPLOYEE FIRST REGISTRATION - company by NAME + pending invitation.
const validateEmployeeRegister = [
  ...firstNameRules,
  ...lastNameRules,
  ...emailRules,
  ...passwordRules,
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters")
    .isString()
    .withMessage("Company name must be a string"),
];

const validateLogin = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateEmployeeRegister,
  validateLogin,
  handleValidationErrors,
};

const { body, validationResult } = require("express-validator");
const { deleteFileFromDisk } = require("../utils/file.util");

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

// Shared company-by-name rule reused by employee and admin registration.
const companyNameRules = [
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters")
    .isString()
    .withMessage("Company name must be a string"),
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
  ...companyNameRules,
];

// COMPANY ADMIN FIRST REGISTRATION - creates a brand-new company.
const validateAdminRegister = [
  ...firstNameRules,
  ...lastNameRules,
  ...emailRules,
  ...passwordRules,
  ...companyNameRules,
];

const validateLogin = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Profile updates are restricted to personal, user-owned fields. email, role,
// company, isActive and timestamps are system-managed and silently ignored by
// the service (the service applies a whitelist regardless of what is sent).
const validateUpdateProfile = [
  body("firstName")
    .optional()
    .trim()
    .isString()
    .withMessage("First name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .optional()
    .trim()
    .isString()
    .withMessage("Last name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .isString()
    .withMessage("Phone must be a string")
    .isLength({ max: 30 })
    .withMessage("Phone must not exceed 30 characters"),
  body("removeAvatar")
    .optional()
    .isBoolean()
    .withMessage("removeAvatar must be a boolean"),
];

const handleValidationErrors = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If an avatar was uploaded before validation failed, remove the temp file
    // so failed requests never leak files into the uploads/tmp directory. Best
    // effort - a cleanup failure must never mask the validation response.
    if (req.file && req.file.path) {
      try {
        await deleteFileFromDisk(req.file.path);
      } catch (error) {
        console.warn(`Failed to clean up uploaded file: ${error.message}`);
      }
    }

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
  validateAdminRegister,
  validateLogin,
  validateUpdateProfile,
  handleValidationErrors,
};

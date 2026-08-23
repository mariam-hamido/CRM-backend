const express = require("express");
const {
  register,
  registerEmployee,
  registerAdmin,
  login,
  me,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  validateRegister,
  validateEmployeeRegister,
  validateAdminRegister,
  validateLogin,
  handleValidationErrors,
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  register
);

// Employee first registration: company NAME + admin-approved invitation.
router.post(
  "/register/employee",
  validateEmployeeRegister,
  handleValidationErrors,
  registerEmployee
);

// Company admin first registration: creates a NEW company + its admin.
router.post(
  "/register/admin",
  validateAdminRegister,
  handleValidationErrors,
  registerAdmin
);

router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  login
);

router.get("/me", authMiddleware, me);

module.exports = router;

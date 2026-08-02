const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const {
  validateRegister,
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

router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  login
);

module.exports = router;

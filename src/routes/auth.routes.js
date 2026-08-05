const express = require("express");
const { register, login, me } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
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

router.get("/me", authMiddleware, me);

module.exports = router;

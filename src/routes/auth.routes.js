const express = require("express");
const { register } = require("../controllers/auth.controller");
const {
  validateRegister,
  handleValidationErrors,
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  register
);

module.exports = router;

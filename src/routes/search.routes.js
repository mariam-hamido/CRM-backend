const express = require("express");
const { search } = require("../controllers/search.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const {
  validateSearchQuery,
  handleValidationErrors,
} = require("../validators/search.validator");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  validateSearchQuery,
  handleValidationErrors,
  search
);

module.exports = router;

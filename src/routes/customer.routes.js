const express = require("express");
const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer.controller");
const {
  validateCustomer,
  handleValidationErrors,
} = require("../validators/customer.validator");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateCustomer,
  handleValidationErrors,
  createCustomer
);

router.get("/", authMiddleware, getCustomers);

router.get("/:id", authMiddleware, getCustomer);

router.put(
  "/:id",
  authMiddleware,
  validateCustomer,
  handleValidationErrors,
  updateCustomer
);

router.delete("/:id", authMiddleware, deleteCustomer);

module.exports = router;

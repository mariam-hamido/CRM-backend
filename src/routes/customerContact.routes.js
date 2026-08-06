const express = require("express");
const {
  createContact,
  getContacts,
  getContact,
  getCustomerContacts,
  updateContact,
  deleteContact,
} = require("../controllers/customerContact.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createContact);

router.get("/", authMiddleware, getContacts);

router.get("/customer/:customerId", authMiddleware, getCustomerContacts);

router.get("/:id", authMiddleware, getContact);

router.put("/:id", authMiddleware, updateContact);

router.delete("/:id", authMiddleware, deleteContact);

module.exports = router;

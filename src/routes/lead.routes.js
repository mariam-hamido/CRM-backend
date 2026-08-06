const express = require("express");
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  convertLead,
} = require("../controllers/lead.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createLead);

router.get("/", authMiddleware, getLeads);

router.get("/:id", authMiddleware, getLead);

router.put("/:id", authMiddleware, updateLead);

router.delete("/:id", authMiddleware, deleteLead);

router.patch("/:id/convert", authMiddleware, convertLead);

module.exports = router;

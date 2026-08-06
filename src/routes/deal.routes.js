const express = require("express");
const {
  createDeal,
  getDeals,
  getDeal,
  updateDeal,
  deleteDeal,
  moveStage,
  markWon,
  markLost,
} = require("../controllers/deal.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createDeal);

router.get("/", authMiddleware, getDeals);

router.get("/:id", authMiddleware, getDeal);

router.put("/:id", authMiddleware, updateDeal);

router.delete("/:id", authMiddleware, deleteDeal);

router.patch("/:id/stage", authMiddleware, moveStage);

router.patch("/:id/won", authMiddleware, markWon);

router.patch("/:id/lost", authMiddleware, markLost);

module.exports = router;

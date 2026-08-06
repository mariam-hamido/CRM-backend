const express = require("express");
const {
  createStage,
  getStages,
  getStage,
  getPipelineStages,
  updateStage,
  deleteStage,
} = require("../controllers/pipelineStage.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createStage);

router.get("/", authMiddleware, getStages);

router.get("/pipeline/:pipelineId", authMiddleware, getPipelineStages);

router.get("/:id", authMiddleware, getStage);

router.put("/:id", authMiddleware, updateStage);

router.delete("/:id", authMiddleware, deleteStage);

module.exports = router;

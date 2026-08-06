const express = require("express");
const {
  createPipeline,
  getPipelines,
  getPipeline,
  updatePipeline,
  deletePipeline,
} = require("../controllers/pipeline.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createPipeline);

router.get("/", authMiddleware, getPipelines);

router.get("/:id", authMiddleware, getPipeline);

router.put("/:id", authMiddleware, updatePipeline);

router.delete("/:id", authMiddleware, deletePipeline);

module.exports = router;

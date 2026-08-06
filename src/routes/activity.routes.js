const express = require("express");
const {
  getActivities,
  getActivity,
  getEntityActivities,
} = require("../controllers/activity.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getActivities
);

router.get(
  "/entity/:entityType/:entityId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getEntityActivities
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getActivity
);

module.exports = router;

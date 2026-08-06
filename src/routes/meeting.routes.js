const express = require("express");
const {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  completeMeeting,
  cancelMeeting,
} = require("../controllers/meeting.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  createMeeting
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getMeetings
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getMeeting
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  updateMeeting
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  deleteMeeting
);

router.patch(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  completeMeeting
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  cancelMeeting
);

module.exports = router;

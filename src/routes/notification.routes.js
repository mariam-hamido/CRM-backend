const express = require("express");
const {
  getNotifications,
  getUnreadCount,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getNotifications
);

router.get(
  "/unread-count",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getUnreadCount
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getNotification
);

router.patch(
  "/:id/read",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  markAsRead
);

router.patch(
  "/read-all",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  markAllAsRead
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  deleteNotification
);

module.exports = router;

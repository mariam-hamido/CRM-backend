const express = require("express");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  completeTask,
  cancelTask,
} = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  createTask
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getTasks
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getTask
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  updateTask
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  deleteTask
);

router.patch(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  completeTask
);

router.patch(
  "/:id/cancel",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  cancelTask
);

module.exports = router;

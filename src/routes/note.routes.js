const express = require("express");
const {
  createNote,
  getNotes,
  getNote,
  getCustomerNotes,
  getLeadNotes,
  getDealNotes,
  getTaskNotes,
  getMeetingNotes,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  createNote
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getNotes
);

router.get(
  "/customer/:customerId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getCustomerNotes
);

router.get(
  "/lead/:leadId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getLeadNotes
);

router.get(
  "/deal/:dealId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getDealNotes
);

router.get(
  "/task/:taskId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getTaskNotes
);

router.get(
  "/meeting/:meetingId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getMeetingNotes
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getNote
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  updateNote
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  deleteNote
);

module.exports = router;

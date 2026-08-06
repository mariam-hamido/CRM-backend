const express = require("express");
const {
  createAttachment,
  getAttachments,
  getAttachment,
  downloadAttachment,
  getCustomerAttachments,
  getLeadAttachments,
  getDealAttachments,
  getTaskAttachments,
  getMeetingAttachments,
  getNoteAttachments,
  deleteAttachment,
} = require("../controllers/attachment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const { upload, handleUploadErrors } = require("../middleware/upload.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  upload.single("file"),
  handleUploadErrors,
  createAttachment
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getAttachments
);

router.get(
  "/customer/:customerId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getCustomerAttachments
);

router.get(
  "/lead/:leadId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getLeadAttachments
);

router.get(
  "/deal/:dealId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getDealAttachments
);

router.get(
  "/task/:taskId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getTaskAttachments
);

router.get(
  "/meeting/:meetingId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getMeetingAttachments
);

router.get(
  "/note/:noteId",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getNoteAttachments
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  getAttachment
);

router.get(
  "/:id/download",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  downloadAttachment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager", "sales"),
  deleteAttachment
);

module.exports = router;

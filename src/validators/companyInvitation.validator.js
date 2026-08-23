const { body, query } = require("express-validator");
const { handleValidationErrors } = require("./auth.validator");

const INVITATION_STATUSES = ["pending", "accepted", "removed"];

const validateCreateInvitation = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("A valid email is required"),
];

const validateListInvitations = [
  query("status")
    .optional()
    .isIn(INVITATION_STATUSES)
    .withMessage(
      "Status must be one of: pending, accepted, removed"
    ),
];

module.exports = {
  validateCreateInvitation,
  validateListInvitations,
};

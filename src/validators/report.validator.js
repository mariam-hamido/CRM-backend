const { query } = require("express-validator");
const { handleValidationErrors } = require("./auth.validator");

const VALID_STATUSES = [
  "active",
  "inactive",
  "prospect",
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiation",
  "converted",
  "lost",
  "open",
  "won",
  "pending",
  "in_progress",
  "completed",
  "cancelled",
  "overdue",
  "scheduled",
  "no_show",
];

const validateReportQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid ISO date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid ISO date"),
  query("status")
    .optional()
    .isString()
    .withMessage("status must be a string")
    .isIn(VALID_STATUSES)
    .withMessage("status is not a valid status"),
  query("owner")
    .optional()
    .isMongoId()
    .withMessage("owner must be a valid MongoDB ObjectId"),
  query("pipelineStage")
    .optional()
    .isMongoId()
    .withMessage("pipelineStage must be a valid MongoDB ObjectId"),
  query("startDate").custom((value, { req }) => {
    if (value && req.query.endDate && new Date(value) > new Date(req.query.endDate)) {
      throw new Error("startDate must be before endDate");
    }

    return true;
  }),
];

module.exports = { validateReportQuery, handleValidationErrors };

const mongoose = require("mongoose");
const { normalizeEmail } = require("../utils/email.util");

const INVITATION_STATUSES = ["pending", "accepted", "removed"];

/**
 * A company-approved employee email, created by a company admin BEFORE the
 * employee registers. The invitation is the allowlist entry that a later
 * first-registration flow will consume (pending -> accepted).
 *
 * Lifecycle: pending -> accepted (registration) | pending -> removed (admin).
 * Removed invitations are kept for audit; a removed email may be re-invited.
 */
const companyInvitationSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "InvitedBy is required"],
    },
    status: {
      type: String,
      enum: INVITATION_STATUSES,
      default: "pending",
    },
    invitedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    removedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// At most ONE pending invitation per company+email (race-safe via MongoDB).
// Removed history and the accepted invitation never violate uniqueness.
companyInvitationSchema.index(
  { company: 1, email: 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

// List pattern: invitations scoped by company, optionally filtered by status.
companyInvitationSchema.index({ company: 1, status: 1 });

// Emails are always stored normalized server-side.
companyInvitationSchema.pre("validate", function () {
  this.email = normalizeEmail(this.email);
});

module.exports = mongoose.model(
  "CompanyInvitation",
  companyInvitationSchema
);
module.exports.INVITATION_STATUSES = INVITATION_STATUSES;

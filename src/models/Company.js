const mongoose = require("mongoose");
const { normalizeCompanyName } = require("../utils/companyName.util");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    // Internal tenant identity derived from `name` (see pre-validate hook).
    // Lookup/uniqueness only; hidden from API responses via toJSON transform.
    // Never accepted from clients - always server-derived.
    nameNormalized: {
      type: String,
      required: [true, "Company name is required"],
      lowercase: true,
      trim: true,
    },
    logo: {
      type: String,
    },
    industry: {
      type: String,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "starter", "professional", "enterprise"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["trial", "active", "suspended", "cancelled"],
      default: "trial",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    currency: {
      type: String,
      default: "USD",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.nameNormalized;
        return ret;
      },
    },
  }
);

// Legacy non-unique index kept as-is (no functional role in identity checks).
companySchema.index({ name: 1, email: 1 });

// Business rule: two ACTIVE companies cannot share a normalized name.
// Soft-deleted companies do not reserve their names. Partial unique index is
// enforced by MongoDB itself (race-condition safe); the filter excludes
// soft-deleted documents so they can never block index creation or reuse.
companySchema.index(
  { nameNormalized: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

// Always derive the identity from the display name server-side.
// Mongoose 9 supports only sync/promise middleware - no `next` callbacks.
companySchema.pre("validate", function () {
  this.nameNormalized = normalizeCompanyName(this.name);
});

module.exports = mongoose.model("Company", companySchema);

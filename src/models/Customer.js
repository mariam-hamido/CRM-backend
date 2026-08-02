const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    industry: {
      type: String,
    },
    website: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
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
    status: {
      type: String,
      enum: ["active", "inactive", "prospect"],
      default: "prospect",
    },
    source: {
      type: String,
      enum: ["website", "referral", "social_media", "cold_call", "email", "advertisement", "other"],
      default: "other",
    },
    annualRevenue: {
      type: Number,
      default: 0,
    },
    employeesCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ company: 1 });
customerSchema.index({ owner: 1 });
customerSchema.index({ companyName: 1 });
customerSchema.index({ email: 1 });

module.exports = mongoose.model("Customer", customerSchema);

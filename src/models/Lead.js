const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: 50,
    },
    companyName: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "proposal_sent", "negotiation", "converted", "lost"],
      default: "new",
      index: true,
    },
    source: {
      type: String,
      enum: ["website", "referral", "social_media", "cold_call", "email", "advertisement", "event", "other"],
      default: "other",
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    estimatedValue: {
      type: Number,
      min: 0,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    convertedCustomer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },
    convertedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

leadSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

leadSchema.index({ company: 1 });
leadSchema.index({ owner: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ score: 1 });

module.exports = mongoose.model("Lead", leadSchema);

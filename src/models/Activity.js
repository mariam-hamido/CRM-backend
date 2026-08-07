const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    entityType: {
      type: String,
      required: [true, "Entity type is required"],
      enum: ["company", "user", "customer", "customer_contact", "lead", "pipeline", "pipeline_stage", "deal", "task", "meeting", "note", "attachment"],
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Entity ID is required"],
      index: true,
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      enum: ["create", "update", "delete", "restore", "assign", "unassign", "convert", "move_stage", "login", "logout", "upload", "download"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000,
    },
    oldValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValues: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      immutable: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Activity", activitySchema);

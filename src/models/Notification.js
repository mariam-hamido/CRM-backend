const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ["system", "task", "meeting", "customer", "lead", "deal", "reminder", "success", "warning", "error"],
      default: "system",
      index: true,
    },
    entityType: {
      type: String,
      enum: ["customer", "lead", "deal", "task", "meeting", "note", "attachment", "user", "company"],
      default: null,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    actionUrl: {
      type: String,
      trim: true,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
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
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

notificationSchema.virtual("isExpired").get(function () {
  return Boolean(this.expiresAt) && this.expiresAt < new Date();
});

module.exports = mongoose.model("Notification", notificationSchema);

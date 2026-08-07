const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
      index: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      default: null,
      index: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
      index: true,
    },
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      default: null,
      index: true,
    },
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null,
      index: true,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    originalFileName: {
      type: String,
      required: [true, "Original file name is required"],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    storageProvider: {
      type: String,
      enum: ["local", "cloudinary", "s3"],
      default: "local",
      index: true,
    },
    mimeType: {
      type: String,
      required: [true, "MIME type is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
      min: 0,
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
        delete ret.__v;
        return ret;
      },
    },
  }
);

attachmentSchema.pre("validate", function () {
  const hasEntity = Boolean(
    this.customer || this.lead || this.deal || this.task || this.meeting || this.note
  );
  if (!hasEntity) {
    this.invalidate(
      "customer",
      "An attachment must be linked to at least one entity (customer, lead, deal, task, meeting, or note)"
    );
  }
});

module.exports = mongoose.model("Attachment", attachmentSchema);

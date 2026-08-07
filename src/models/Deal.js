const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
      index: true,
    },
    pipeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
      required: [true, "Pipeline is required"],
      index: true,
    },
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PipelineStage",
      required: [true, "Stage is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Deal title is required"],
      trim: true,
      maxlength: 200,
    },
    value: {
      type: Number,
      required: [true, "Deal value is required"],
      min: 0,
      default: 0,
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    expectedCloseDate: {
      type: Date,
      index: true,
    },
    actualCloseDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "won", "lost"],
      default: "open",
      index: true,
    },
    lostReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    description: {
      type: String,
      trim: true,
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

module.exports = mongoose.model("Deal", dealSchema);

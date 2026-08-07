const mongoose = require("mongoose");

const pipelineStageSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },
    pipeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
      required: [true, "Pipeline is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Stage name is required"],
      trim: true,
      maxlength: 100,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    order: {
      type: Number,
      required: [true, "Stage order is required"],
      min: 1,
      index: true,
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isWonStage: {
      type: Boolean,
      default: false,
    },
    isLostStage: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
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

module.exports = mongoose.model("PipelineStage", pipelineStageSchema);

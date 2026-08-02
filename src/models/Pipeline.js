const mongoose = require("mongoose");

const pipelineSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Pipeline name is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    color: {
      type: String,
      default: "#3B82F6",
    },
    isDefault: {
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

pipelineSchema.index({ company: 1 });
pipelineSchema.index({ name: 1 });
pipelineSchema.index({ isDefault: 1 });

module.exports = mongoose.model("Pipeline", pipelineSchema);

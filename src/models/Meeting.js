const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
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
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required"],
      index: true,
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      default: null,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Meeting title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    meetingDate: {
      type: Date,
      required: [true, "Meeting date is required"],
      index: true,
    },
    duration: {
      type: Number,
      default: 60,
      min: 1,
    },
    meetingType: {
      type: String,
      enum: ["in_person", "phone", "video"],
      default: "in_person",
    },
    location: {
      type: String,
      trim: true,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no_show"],
      default: "scheduled",
      index: true,
    },
    notes: {
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
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

meetingSchema.virtual("isUpcoming").get(function () {
  return this.meetingDate > new Date();
});

meetingSchema.index({ company: 1 });
meetingSchema.index({ customer: 1 });
meetingSchema.index({ organizer: 1 });
meetingSchema.index({ deal: 1 });
meetingSchema.index({ meetingDate: 1 });
meetingSchema.index({ status: 1 });

module.exports = mongoose.model("Meeting", meetingSchema);

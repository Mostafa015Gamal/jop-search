import { model, Schema } from "mongoose";

export const jobLocations = {
  onsite: "onsite",
  remotely: "remotely",
  hybrid: "hybrid",
};
export const workingTimes = {
  partTime: "partTime",
  fullTime: "fullTime",
};
export const seniorityLevels = {
  fresh: "fresh",
  Junior: "Junior",
  MidLevel: "MidLevel",
  Senior: "Senior",
  TeamLead: "TeamLead",
  CTO: "CTO",
};
const jobSchema = new Schema(
  {
    jobTitle: { type: String, required: true },
    jobLocation: {
      type: String,
      enum: Object.values(jobLocations),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTimes),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevels),
      required: true,
    },
    jobDescription: { type: String, required: true },
    technicalSkills: [{ type: String, required: true }],
    softSkills: [{ type: String, required: true }],
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    closed: { type: Boolean, default: false },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

const Job = model("Job", jobSchema);
export default Job;

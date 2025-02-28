import { model, Schema } from "mongoose";

const applicationSchema = Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userCV: { secure_url: String, public_id: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "viewed", "in consideration", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Application = model("Application", applicationSchema);
export default Application;

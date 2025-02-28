import { model, Schema } from "mongoose";

const companySchema = new Schema(
  {
    companyName: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, required: true },
    numberOfEmployees: { type: String, required: true }, // Example: "11-20"
    companyEmail: { type: String, unique: true, required: true },
    CreatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Logo: { secure_url: String, public_id: String },
    coverPic: { secure_url: String, public_id: String },
    HRs: [{ type: Schema.Types.ObjectId, ref: "User" }],
    bannedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    legalAttachment: { secure_url: String, public_id: String },
    approvedByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);
export default Company;

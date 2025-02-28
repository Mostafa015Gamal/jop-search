import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { hash } from "../../utils/hashing/hashing.js";
import { model, Schema, Types } from "mongoose";

export const genders = {
  male: "male",
  female: "female",
};
export const roles = {
  user: "user",
  admin: "admin",
};
export const providers = {
  google: "google",
  system: "system",
};
export const emailOrPassword = {
  confirmEmail: "confirmEmail",
  forgetPassword: "forgetPassword",
};

export const defaultProfilePicture =
  "uploads//sakjweyakdhsakjflhisda__defualt_ProfilePicture.png";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false;
      },
    },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
    gender: { type: String, enum: Object.values(genders), required: true },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const ageDiff = new Date().getFullYear() - value.getFullYear();
          return ageDiff >= 18;
        },
        message: "User must be at least 18 years old.",
      },
    },
    mobileNumber: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(roles),
      required: true,
      default: roles.user,
    },
    isConfirmed: { type: Boolean, default: false },
    deletedAt: { type: Boolean, default: false },
    bannedAt: { type: Boolean, default: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    changeCredentialTime: { type: Date },
    profilePic: {
      type: String,
      default: defaultProfilePicture,
    },
    coverPics: [String],
    freezed: { type: Boolean, default: false },
    OTP: [
      {
        code: String,
        type: { type: String, enum: Object.values(emailOrPassword) },
        expiresIn: Date,
      },
    ],
  },
  { timestamps: true },
  { toJSON: { getters: true }, toObject: { getters: true } }
);

userSchema.virtual("username").get(function () {
  return `${this.firstName}${this.lastName}`;
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hash({ plainText: this.password });
  }
  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt({ plainText: this.mobileNumber });
  }
  return next();
});

userSchema.post("findOne", function (doc, next) {
  if (doc && doc.mobileNumber) {
    doc.mobileNumber = decrypt({ cipherText: doc.mobileNumber });
  }
  return next();
});

const User = model("User", userSchema);

export default User;

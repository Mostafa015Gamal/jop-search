import path from "path";
import User, { defaultProfilePicture } from "../../DB/models/user.model.js";
import { decrypt, encrypt } from "../../utils/encryption/encryption.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { compareHash, hash } from "../../utils/hashing/hashing.js";
import fs from "fs";

export const updateUser = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, DOB, mobileNumber, gender } = req.body;
  const { user } = req;

  const updateData = { DOB, firstName, lastName, gender };

  if (mobileNumber) {
    updateData.mobileNumber = encrypt(mobileNumber);
  }

  await User.findByIdAndUpdate(user._id, updateData, { new: true });

  return res.status(200).json({ message: "user updated successfully!" });
});

export const getProfileData = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const userData = await User.findOne({ _id: user._id }).select(
    "-password -OTP -freezed -bannedAt -deletedAt -isConfirmed"
  );

  res.status(200).json({ userData });
});

export const getAnotherUserData = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) return next(new Error("user id required"));

  const userData = await User.findOne({ _id: userId }).select(
    "userName mobileNumber profilePic coverPic"
  );

  res.status(200).json({ userData });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { oldPassword, newPassword } = req.body;

  if (!compareHash({ plainText: oldPassword, hash: user.password }))
    return next(new Error("the password is incorrect", { cause: 400 }));
  if (oldPassword == newPassword)
    return next(
      new Error("New password cannot be the same as the old password", {
        cause: 400,
      })
    );
  const password = hash({ plainText: newPassword });

  await User.findByIdAndUpdate(user._id, { password }, { new: true });

  return res.status(200).json({ message: "updated successfully" });
});

export const profilePicture = asyncHandler(async (req, res, next) => {
  if (!req.file)
    return next(
      new Error("Please upload a valid profile picture", { cause: 400 })
    );
  await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePic: req.file.path,
    },
    { new: true }
  );
  return res.status(200).json({ message: "upload successfully" });
});

export const addCoverPictures = asyncHandler(async (req, res, next) => {
  if (!req.files)
    return next(
      new Error("Please upload a valid cover picture", { cause: 400 })
    );
  await User.findByIdAndUpdate(
    req.user._id,
    {
      coverPics: req.files.map((file) => file.path),
    },
    { new: true }
  );
  return res.status(200).json({ message: "upload successfully" });
});

export const deleteProfilePicture = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const imgPath = path.resolve(".", user.profilePic);
  fs.unlinkSync(imgPath);
  user.profilePic = defaultProfilePicture;
  await user.save();
  return res.status(200).json({ message: "deleted successfully" });
});

export const deleteCoverPictures = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  user.coverPics = defaultProfilePicture;
  await user.save();
  return res.status(200).json({ message: "deleted successfully" });
});

export const softDeleteUser = asyncHandler(async (req, res, next) => {
  const { user } = req;

  if (user.deletedAt) return next(new Error("Account already deleted"));

  const data = await User.findByIdAndUpdate(
    user._id,
    { deletedAt: true },
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Account deleted successfully (Soft Delete)" });
});

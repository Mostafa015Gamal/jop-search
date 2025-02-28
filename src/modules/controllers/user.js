import { Router } from "express";
import validation from "../../middleware/schema.validation.js";
import * as userServices from "../services/user.js";
import * as userSchema from "../../validation/user.validation.js";
import isAuthenticated from "../../middleware/authentication.validation.js";
import upload, {
  fileValidation,
} from "../../utils/file uploading/multerUpload.js";

const userRouter = Router();

userRouter.post(
  "/update_user",
  isAuthenticated,
  validation(userSchema.updateUser),
  userServices.updateUser
);

userRouter.get("/user_data", isAuthenticated, userServices.getProfileData);

userRouter.get(
  "/another_user_data/:userId",
  isAuthenticated,
  userServices.getAnotherUserData
);

userRouter.post(
  "/update_password",
  isAuthenticated,
  validation(userSchema.updatePassword),
  userServices.updatePassword
);
userRouter.post(
  "/profilePicture",
  isAuthenticated,
  upload(fileValidation.images).single("image"),
  userServices.profilePicture
);
userRouter.post(
  "/coverPics",
  isAuthenticated,
  upload(fileValidation.images).array("images"),
  userServices.addCoverPictures
);
userRouter.delete(
  "/delete_profilePicture",
  isAuthenticated,
  userServices.deleteProfilePicture
);
userRouter.delete(
  "/delete_coverPictures",
  isAuthenticated,
  userServices.deleteCoverPictures
);
userRouter.delete(
  "/softDeleteUser",
  isAuthenticated,
  userServices.softDeleteUser
);
export default userRouter;

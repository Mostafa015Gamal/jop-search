import { Router } from "express";
import validation from "../../middleware/schema.validation.js";
import * as authSchema from "../../validation/auth.validation.js";
import * as authServices from "../services/auth.js";
import upload from "../../utils/file uploading/multerUpload.js";
const authRouter = Router();

authRouter.post(
  "/register",
  validation(authSchema.register),
  authServices.register
);

authRouter.post(
  "/confirmEmail",
  validation(authSchema.confirmEmail),
  authServices.confirmEmail
);

authRouter.post("/login", validation(authSchema.login), authServices.login);

authRouter.post(
  "/loginWithGmail",
  validation(authSchema.loginWithGmail),
  authServices.loginWithGmail
);

authRouter.post(
  "/forget-password",
  validation(authSchema.forgetPassword),
  authServices.forgetPassword
);

authRouter.post(
  "/reset-password",
  validation(authSchema.resetPassword),
  authServices.resetPassword
);

authRouter.post(
  "/reset-password",
  validation(authSchema.resetPassword),
  authServices.resetPassword
);
authRouter.post(
  "/new_access_token",
  validation(authSchema.newAccessToken),
  authServices.newAccessToken
);

export default authRouter;

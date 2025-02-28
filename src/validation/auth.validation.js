import joi from "joi";
import { genders } from "../DB/models/user.model.js";

export const register = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    firstName: joi.string().min(3).max(15).required(),
    lastName: joi.string().min(3).max(15).required(),
    mobileNumber: joi.string().required(),
    gender: joi.string().valid(...Object.values(genders)),
    DOB: joi.string(),
  })
  .required();

export const confirmEmail = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
  })
  .required();

export const login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const loginWithGmail = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();

export const forgetPassword = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

export const resetPassword = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
    otp: joi.string().required(),
  })
  .required();

export const newAccessToken = joi
  .object({ refreshToken: joi.string().required() })
  .required();

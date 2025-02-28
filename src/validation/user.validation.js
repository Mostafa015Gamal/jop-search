import joi from "joi";
import { genders } from "../DB/models/user.model.js";

export const updateUser = joi
  .object({
    firstName: joi.string().min(3).max(15).required(),
    lastName: joi.string().min(3).max(15).required(),
    mobileNumber: joi.string().required(),
    gender: joi.string().valid(...Object.values(genders)),
    DOB: joi.string(),
  })
  .required();

export const updatePassword = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();

import User, {
  emailOrPassword,
  providers,
} from "../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import Randomstring from "randomstring";
import { compareHash, hash } from "../../utils/hashing/hashing.js";
import { emailEmitter } from "../../utils/email/email.event.js";
import { OAuth2Client } from "google-auth-library";
import { generateToken, verifyToken } from "../../utils/Token/token.js";
import { subjects } from "../../utils/email/sendEmail.js";

export const register = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) return next(new Error("Email already exist!", { cause: 400 }));

  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
  const hashedOTP = hash({ plainText: otp });
  await User.create({
    ...req.body,
    provider: providers.system,
    OTP: [
      {
        code: hashedOTP,
        type: emailOrPassword.confirmEmail,
        expiresIn: new Date(Date.now() + 10 * 60 * 1000),
      },
    ],
  });
  emailEmitter.emit("sendEmail", email, otp, subjects.register);
  res
    .status(201)
    .json({ message: "user created successfully. Please verify your email." });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error("User Not found!", { cause: 400 }));

  const otpRecord = user.OTP.find(
    (otpEntry) => otpEntry.type === "confirmEmail"
  );

  if (!otpRecord)
    return next(
      new Error("No OTP found for email confirmation", { cause: 400 })
    );

  if (otpRecord.expiresIn < new Date())
    return next(new Error("OTP has expired", { cause: 400 }));
  if (!compareHash({ plainText: otp, hash: otpRecord.code }))
    return next(new Error("Invalid OTP"));

  user.isConfirmed = true;
  user.OTP = user.OTP.filter((entry) => entry.type !== "confirmEmail");
  await user.save();
  return res.status(200).json({ message: "Email confirmed successfully!" });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error("User Not found!", { cause: 400 }));

  if (user.provider !== "system")
    return next(new Error("Please sign in using Google", { cause: 400 }));

  if (!user.isConfirmed)
    return next(new Error("Please confirm your email first", { cause: 400 }));

  if (user.bannedAt)
    return next(new Error("Your account has been banned", { cause: 403 }));

  if (user.deletedAt)
    return next(new Error("Your account has been deleted", { cause: 403 }));

  if (!compareHash({ plainText: password, hash: user.password }))
    return next(new Error("Invalid email or password", { cause: 404 }));

  const accessToken = generateToken({
    payload: { Id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });

  const refreshToken = generateToken({
    payload: {
      userId: user._id,
      email: user.email,
    },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  });

  return res.status(200).json({
    message: "login successful",
    accessToken,
    refreshToken,
  });
});

export const loginWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID, // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const userData = await verify();
  const { email_verified, email, firstName, lastName, photoUrl } = userData;
  if (!email_verified)
    return next(new Error("Email is invalid", { cause: 400 }));
  const user = await User.create({
    email,
    firstName,
    lastName,
    profilePic: photoUrl,
    isConfirmed: true,
    provider: providers.google,
  });

  const access_token = generateToken({
    payload: {
      id: user._id,
      email: user.email,
    },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });
  const refresh_token = generateToken({
    payload: {
      id: user._id,
      email: user.email,
    },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE },
  });

  return res
    .status(200)
    .json({ message: "login Successfully", access_token, refresh_token });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isConfirmed: true, freezed: false });
  if (!user) return next(new Error("User Not found!", { cause: 400 }));

  const otp = Randomstring.generate({ length: 5, charset: "alphabetic" });
  const hashedOTP = hash({ plainText: otp });
  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        OTP: [
          {
            code: hashedOTP,
            type: emailOrPassword.forgetPassword,
            expiresIn: new Date(Date.now() + 10 * 60 * 1000),
          },
        ],
      },
    },
    {
      new: true,
    }
  );

  emailEmitter.emit("sendEmail", email, otp, subjects.resetPass);

  return res.status(201).json({ message: "OTP send successfully" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error("User Not found!", { cause: 400 }));

  const otpRecord = user.OTP.find(
    (otpEntry) => otpEntry.type === "forgetPassword"
  );
  if (!otpRecord)
    return next(
      new Error("No OTP found for email confirmation", { cause: 400 })
    );

  if (otpRecord.expiresIn < new Date())
    return next(new Error("OTP has expired", { cause: 400 }));
  if (!compareHash({ plainText: otp, hash: otpRecord.code }))
    return next(new Error("Invalid OTP"));

  user.password = password;
  user.OTP = user.OTP.filter((entry) => entry.type !== "forgetPassword");
  user.changeCredentialTime = Date.now();
  await user.save();

  return res
    .status(200)
    .json({ message: "reset password successfully. Try to login" });
});

export const newAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;
  const payload = verifyToken({ token: refreshToken });
  const user = await User.findById(payload.userId);

  if (
    user.changeCredentialTime &&
    payload.iat * 1000 < user.changeCredentialTime
  ) {
    return next(
      new Error("Token expired due to password change. Please log in again.", {
        cause: 401,
      })
    );
  }

  if (!user) return next(new Error("User Not found!", { cause: 400 }));

  const accessToken = generateToken({
    payload: { Id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
  });

  return res
    .status(200)
    .json({ message: "new access token created", accessToken });
});

import User from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/error handling/asyncHandler.js";
import { verifyToken } from "../utils/Token/token.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return next(new Error("Token is required!"));
  if (!authorization.startsWith("Bearer"))
    return next(new Error("Invalid Token!", { cause: 403 }));

  const token = authorization.split(" ")[1];

  const { Id, iat } = verifyToken({ token });

  const user = await User.findById(Id).lean();

  if (!user) return next(new Error("User not found!", { cause: 404 }));

  if (user.changeCredentialTime?.getTime() >= iat * 1000)
    return next(new Error("Invalid credentials", { cause: 400 }));

  req.user = user;
  return next();
});

export default isAuthenticated;

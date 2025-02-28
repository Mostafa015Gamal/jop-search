import connectDB from "./DB/connection.js";
import globalErrorHandler from "./utils/error handling/globalErrorHandler.js";
import notFoundHandler from "./utils/error handling/notFoundHandler.js";
import authRouter from "./modules/controllers/auth.js";
import userRouter from "./modules/controllers/user.js";

const bootstrap = async (app, express) => {
  await connectDB();
  app.use(express.json());
  app.use("/uploads", express.static("uploads"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};

export default bootstrap;

import cron from "node-cron";
import User from "../../DB/models/user.model.js";

cron.schedule("0 */6 * * *", async () => {
  console.log("Running CRON Job: Deleting expired OTP codes...");

  const currentTime = new Date();

  const result = await User.updateMany(
    {},
    { $pull: { OTP: { expiresIn: { $lt: currentTime } } } }
  );

  console.log(` Expired OTPs deleted: ${result.modifiedCount}`);
});

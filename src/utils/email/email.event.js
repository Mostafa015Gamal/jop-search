import { EventEmitter } from "events";
import { signup } from "./generateHTML.js";
import sendEmails, { subjects } from "./sendEmail.js";
export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async (email, otp, subject) => {
  await sendEmails({
    to: email,
    subject,
    html: signup(otp),
  });
});

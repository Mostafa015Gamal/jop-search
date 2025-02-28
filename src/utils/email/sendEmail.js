import nodemailer from "nodemailer";

const sendEmails = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `"Jop Search Application"<${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  return info.rejected.length == 0 ? true : false;
};

export const subjects = {
  register: "Activate Account",
  resetPass: "Reset Password",
};
export default sendEmails;

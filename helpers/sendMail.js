import nodemailer from "nodemailer";
import "dotenv/config";

const { EMAIL, EMAIL_PASS } = process.env;

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(config);

const sendMail = (data) => {
  const latter = { ...data, from: EMAIL };

  return transporter.sendMail(latter);
};

export default sendMail;

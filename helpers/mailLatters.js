import "dotenv/config";
const { EMAIL } = process.env;

export const resetPasswordLatter = (email, username, link) => {
  return {
    to: `${email}`,
    subject: "Water Tracker: Reset password",
    text: `Hello, ${username}, \nIf you have received this email, it means that a request has been made to reset the password for your account. \nIf this was you, please follow the link below to complete the password reset process:\n${link}\nIf you did not initiate this request or believe it to be in error, please disregard this email or promptly contact our support team at ${EMAIL} \nThank you for your understanding and cooperation.\nBest regards,\nWater Tracker Support Team`,
    html: `    <div
      style="
        background-image: url(https://res.cloudinary.com/dmmsw1ano/image/upload/v1704188253/water-project/public/isdrjnh8hrqscje4p9bx.png);
        font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif,
          'Oxygen', 'Ubuntu';
        color: #2f2f2f;
      "
    >
      <div style="text-align: center">
        <img
          src="https://res.cloudinary.com/dmmsw1ano/image/upload/v1704189197/water-project/public/riogxojqmp3snoigydb2.png"
        />
      </div>
      <h1 style="font-size: 18px; text-align: center">
        Password Reset Request
      </h1>
      <p>Hello, ${username},</p>
      <p>
        If you have received this email, it means that a request has been made
        to reset the password for your account.
      </p>
      <p>
        If this was you, please follow the link below to complete the password
        reset process:
      </p>
      <p style="text-align: center; margin: 20px 0">
        <a
          href="${link}"
          style="
            text-decoration: none;
            padding: 8px 30px;
            box-shadow: 0px 4px 8px 0px rgba(64, 123, 255, 0.34);
            border-radius: 10px;
            color: #ffffff;
            background-color: #407bff;
          "
          >Reset password</a
        >
      </p>
      <p>
        If you did not initiate this request or believe it to be in error,
        please disregard this email or promptly contact our support team at
        ${EMAIL}
      </p>
      <br>
        Thank you for your understanding and cooperation. <br> Best regards,Water <br>
        Tracker Support Team.
      </p>
    </div>`,
  };
};

const transporter = require("./transporter");
const dotenv = require("dotenv");
dotenv.config();

const loginEmail = async (name, email) => {
  try {
    const info = await transporter.sendMail({
      from: `"SQI Clinics" <${process.env.app_email}>`,
      to: email,
      subject: `You just signed in ${name}`,
      text: `Dear ${name}, you just logged in to your account. We just thought we should let you know`,
    });

    console.log("Login Email sent successfully", info.response);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

module.exports = loginEmail;

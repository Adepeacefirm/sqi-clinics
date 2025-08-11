const transporter = require("./transporter");
const dotenv = require("dotenv");
dotenv.config();

const singUpEmail = async (email, name) => {
  try {
    const info = await transporter.sendMail({
      from: `"SQI Clinics" <${process.env.app_email}>`,
      to: email,
      subject: `Welcome onboard ${name.split(" ")[0]}. You just signed up`,
      text: `Dear ${name}, You beat the odds. Now you just just the fastest-moving train`,
    });

    console.log("Signup Email sent successfully", info.response);
  } catch (error) {
    console.error("Error sending email", error);
  }
};

module.exports = singUpEmail;

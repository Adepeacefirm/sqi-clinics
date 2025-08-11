const transporter = require("./transporter");

const dotenv = require("dotenv");

dotenv.config();

const bookAppointmentEmail = async (name, email) => {
  try {
    const info = await transporter.sendMail({
      from: `"SQI Clinics" <${process.env.app_email}>`,
      to: email,
      subject: "You appoiment has been booked",
      text: `Dear ${
        name.split(" ")[0]
      }, your appointment has been booked successfully. It's a good internation practise to keep up with your appointment`,
    });

    console.log(
      "Book Appointment Email has been sent successfully",
      info.response
    );
  } catch (error) {
    console.log("try-catch error: ", error.message);
  }
};

module.exports = bookAppointmentEmail;

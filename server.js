const app = require("./app");

const connectToDb = require("./config/connectToDB");

const connectToCloudinary = require("./config/cloudinary");

console.log("Hello");

const PORT = process.env.PORT || 3700;

app.listen(PORT, () => {
  console.log(`Server is running on port 3700`);
});

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to Homepage",
  });
});

connectToDb();
connectToCloudinary();

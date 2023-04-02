const express = require("express");
require("dotenv").config();
const connection = require("./config/db");
const cors = require("cors");

const session = require("express-session");
const userRouter = require("./routes/user.routes");
const userDataRouter = require("./routes/userdata.route");
const auth = require("./middlewares/auth.middleware");
const adminRouter = require("./routes/admin.routes");
const nutriRouter = require("./routes/nutrient.route");

const app = express();
app.use(cors());

// Middleware --
app.use(express.json());
app.use(
  session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/nutrient", nutriRouter); // to get all data

// to make relationship between users and data
app.use(auth);
app.use("/userdata", userDataRouter); // dashboard and diary -- with token

// listening to server --
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to db");
  } catch (err) {
    console.log("Error in connectiong to db");
  }
  console.log(`Server listening on ${process.env.port}`);
});




/*

  try {
    // Reconfirming email address exists or not
    // const isEmail = await UserModel.find({ email: email });
    // if (isEmail.length > 0) {
    //   return res.status(400).send({ message: "Email already exists" });
    // }

    // changing date to readabel format
    const dateString = birthday;
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    console.log(formattedDate);

    // hashing the password
    bcrypt.hash(password, 4, async (err, hash) => {
      const payload = {
        email,
        password: hash,
        sex,
        birthday: formattedDate,
        height,
        weight,
        active,
      };
      const user = new UserModel(payload);
      await user.save();
      res.status(200).send({ message: "Signup successful" });
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }

*/
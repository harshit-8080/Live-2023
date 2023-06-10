const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const { auth } = require("./middlewares/auth");

const app = express();
app.use(express.json());

app.get("/", auth, (req, res) => {
  return res.status(200).json({
    message: "Okkkkkkkkkk",
  });
});

app.get("/home", auth, (req, res) => {
  return res.status(200).json({
    message: "Welcome to home",
  });
});

// SIGNUP API
app.post("/signup", async (req, res) => {
  try {
    let user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };

    const salt = bcrypt.genSaltSync(8);
    user.password = bcrypt.hashSync(req.body.password, salt);

    const response = await User.create(user);

    return res.status(201).json({
      message: response,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// LOGOIN API
app.post("/signin", async (req, res) => {
  try {
    const email = req.body.email;
    const checkEmail = await User.findOne({ email: email });

    if (checkEmail) {
      const checkPassword = bcrypt.compareSync(
        req.body.password,
        checkEmail.password
      );

      if (checkPassword) {
        const token = jwt.sign({ email }, "shhjjasshhh", { expiresIn: "2d" });

        return res.status(200).json({
          message: "Logged In",
          yourToken: token,
        });
      } else {
        return res.status(200).json({
          message: "Password is not Correct",
        });
      }
    } else {
      return res.status(409).json({
        message: "email not valid",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      message: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(3000, async () => {
  console.log("server started at 3000");

  try {
    await mongoose.connect(
      "mongodb+srv://harshittalks71:y2XtMBm5NHKwxE70@cluster0.ynao7w7.mongodb.net/"
    );
    console.log("Database Connection Done");
  } catch (error) {
    console.log("Database Connection Failed");
  }
});

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.auth = async (req, res, next) => {
  const token = req.get("Authorization");

  if (token) {
    const payload = await jwt.verify(token.split(" ")[1], "shhjjasshhh");
    // console.log(payload);
    const email = payload.email;
    console.log(email);
    const CheckEmail = await User.findOne({ email: email });
    if (CheckEmail) {
      next();
    } else {
      return res.json({
        message: "invalid token 1",
      });
    }
  } else {
    return res.json({
      message: "invalid token 2",
    });
  }
};

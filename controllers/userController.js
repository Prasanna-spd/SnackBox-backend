require("dotenv").config();
const User = require("../models/user");
const Order = require("../models/Orders");
const { response } = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;

const forgetPasswordMail = async (name, mail, token) => {
  try {
    const transporter = nodemailer.createTransport("SMTP", {
      service: "Gmail",
      auth: {
        useremail: process.env.USER_EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: mail,
      subject: "For Reset Password",
      html: `<p>Hii ${name}. Please copy the link ${`http://localhost:5000/api/forgetPassword?token=${token}`} to reset the password</p>`,
    };
    transporter.sendMail(mailOptions, function (error, msg) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent :-", msg.response);
      }
    });
  } catch (error) {
    response.status(400).send({ success: false, msg: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const resetUser = await User.findOne({ email: email });

    if (resetUser) {
      let resetToken = crypto.randomBytes(32).toString("hex");
      //   const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));
      const reset = await User.updateOne(
        { email: email },
        { $set: { token: resetToken } }
      );
      forgetPasswordMail(resetUser.name, email, resetToken);
      res.status(200).send({ success: true, msg: "Check your mail" });
    } else {
      res
        .status(200)
        .send({ success: true, msg: "This email does not exsist" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const loginUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ results: result.array() });
  }
  let email = req.body.email;

  try {
    let userData = await User.findOne({ email });
    if (!userData) {
      return res
        .status(400)
        .json({ errors: "Try Logging With Proper Credentials" });
    }
    const compaPassw = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (!compaPassw) {
      return res
        .status(400)
        .json({ errors: "Try Logging With Proper password" });
    }

    const data = {
      user: {
        id: userData.id,
      },
    };

    const token = jwt.sign(data, jwtSecret);

    return res.json({ success: true, authToken: token });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

const displayData = (req, res) => {
  try {
    // console.log(global.food_items);
    res.send([global.food_items, global.foodCategory]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

const createUser = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ results: result.array() });
  }

  const salt = await bcrypt.genSalt(10);
  let securePass = await bcrypt.hash(req.body.password, salt);

  try {
    await User.create({
      name: req.body.name,
      password: securePass,
      email: req.body.email,
      location: req.body.location,
    });

    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

const orderData = async (req, res) => {
  let data = req.body.order_data;
  await data.splice(0, 0, { Order_date: req.body.order_date });

  let eId = await Order.findOne({ email: req.body.email });
  // console.log(eId);
  if (eId === null) {
    try {
      await Order.create({
        email: req.body.email,
        order_data: [data],
      }).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error: " + error.message);
    }
  } else {
    try {
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      ).then(() => {
        res.json({ success: true });
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error: " + error.message);
    }
  }
};

const myOrderData = async (req, res) => {
  try {
    let myData = await Order.findOne({ email: req.body.email });
    res.json({ orderData: myData });
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
};

module.exports = {
  forgetPassword,
  loginUser,
  displayData,
  createUser,
  orderData,
  myOrderData,
};

const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userController = require("../controllers/userController");

const { loginUser } = userController;

router.post(
  "/loginUser",
  body("email").isEmail(),
  body("password", "incorrect Password").isLength({ min: 5 }),
  loginUser
);

module.exports = router;

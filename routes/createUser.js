const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userController = require("../controllers/userController");
const { createUser } = userController;

router.post(
  "/createUser",
  body("email").isEmail(),
  body("name").isLength({ min: 5 }),
  body("password", "incorrect Password").isLength({ min: 5 }),
  createUser
);

module.exports = router;

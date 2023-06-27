const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const { forgetPassword } = userController;

router.post("/forgetPassword", forgetPassword);

module.exports = router;

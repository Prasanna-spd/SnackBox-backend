const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { displayData } = userController;

router.post("/foodData", displayData);

module.exports = router;

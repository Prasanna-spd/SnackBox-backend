const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { orderData, myOrderData } = userController;

router.post("/orderData", orderData);

router.post("/myorderData", myOrderData);

module.exports = router;

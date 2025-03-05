//express
const express = require("express");
const route = express.Router();

//checkAccessWithSecretKey
const checkAccessWithSecretKey = require("../../util/checkAccess");

//controller
const OrderController = require("./order.controller");

//create order
route.post("/create", checkAccessWithSecretKey(), OrderController.createOrder);

//update order
route.patch("/update", checkAccessWithSecretKey(), OrderController.updateOrder);

module.exports = route;

const express = require("express");

const orderBumpController = require("../controllers/order-bump-controllers");
const router = express.Router();

router.get("/fetch-details", orderBumpController.getOrderBumps);


module.exports = router;

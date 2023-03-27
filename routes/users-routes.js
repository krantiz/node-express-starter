const express = require("express");
const usersController = require("../controllers/users-controllers");
const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/postusers",
  usersController.postUsers
);

module.exports = router;

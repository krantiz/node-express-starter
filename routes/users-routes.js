const express = require("express");
const usersController = require("../controllers/users-controllers");
const router = express.Router();
const Joi = require('joi');
router.get("/", usersController.getUsers);

router.post(
  "/postusers",
  (req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    console.log('req.body', req.body)
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Create user with validated input
  },
  usersController.postUsers
);
router.get(
  "/getuser",
  usersController.getUsers
);

module.exports = router;

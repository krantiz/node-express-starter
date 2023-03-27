const HttpError = require("../models/http-error");
const pool = require("../database");
require("dotenv").config();

const usersController = {
  getUsers: async (req, res, next) => {
    let user;
    try {
      // simple query
      const [rows, fields] = await pool.query('SELECT * FROM wp_users');
  
      user = rows;
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "Fetching users failed, please try again later.",
        500
      );
      return next(error);
    }
    res.json([{ data: user }]);
  },
  
  postUsers: async (req, res, next) => {
    const errors = req;
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422)
      );
    }
  
    const { name, email, password } = req.body;
  
    res.status(201).json({ userId: name, email: email, token: password });
  }
}

module.exports = usersController;

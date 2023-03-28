const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const fs = require("fs");
var Constants = require('./utils/Contants');

const port = process.env.PORT || 8000;
const usersRoutes = require("./routes/users-routes");
const auth = require("./middlewares/auth");
const roleCheck = require("./middlewares/role");

const cors = require("cors");
const app = express();

// Middlewares..
app.use(cors({
  origin: ['*']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parsing the request

// set up multer storage engine
// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     const dir = path.join(__dirname, "uploads/feedback");
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }

//     callback(null, dir);
//   },

//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage });

app.use(
  "/api/users",
  // auth.verifyToken,
  // roleCheck.authorise([Constants.ROLES.student, Constants.ROLES.teacher]),
  usersRoutes
);

router.use((req, res, next) => {
  // Can use it future
  const error = new HttpError("Could not find this route.", 404);
  throw error;
  next();
});

//Running port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

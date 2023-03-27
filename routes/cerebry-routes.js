const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const cerebryController = require("../controllers/cerebry-controllers")


router.get("/user/:userName/login/", cerebryController.loginUser);

router.post(
  "/register-user/",
  [
    check("username").not().isEmpty(),
    check("first_name").not().isEmpty(),
    check("last_name").not().isEmpty(),
    check("type").not().isEmpty(),
    check("phone_number").not().isEmpty(),
    check("packages").isArray(),
    check("email").normalizeEmail().isEmail(),
    check("is_guest").isBoolean()
  ],
  cerebryController.registerUser
);

router.post(
  "/user/:userName/add-package/",
  [
    check("package").not().isEmpty(),
    check("first_name").not().isEmpty(),
    check("start_date").not().isEmpty(),
  ],
  cerebryController.addUserPackage
);

router.post(
  "/user/:userName/remove-package/",
  [
    check("package").not().isEmpty(),
  ],
  cerebryController.removeUserPackage
);

router.post(
  "/user/:userName/edit-package/",
  [
    check("package").not().isEmpty(),
    check("first_name").not().isEmpty(),
    check("start_date").not().isEmpty(),
  ],
  cerebryController.editUserPackage
);

router.post(
  "/*",
  cerebryController.postRequestHandler
);

router.get(
  "/*",
  cerebryController.getRequestHandler
);

module.exports = router;


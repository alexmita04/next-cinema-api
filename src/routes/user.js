const express = require("express");
const userController = require("../controllers/user");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.route("/login").post(userController.login);

router.route("/register").post(userController.register);

router.route("/refresh").post(userController.refresh);

router.route("/logout").post(authenticate, userController.logout);

module.exports = router;

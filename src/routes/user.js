const express = require("express");
const userController = require("../controllers/user");
const { authenticate, isUser, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.route("/login").post(userController.login);

router.route("/register").post(userController.register);

router.route("/refresh").post(userController.refresh);

router.route("/logout").post(authenticate, userController.logout);

router.route("/profile").get(authenticate, isUser, userController.getProfile);

module.exports = router;

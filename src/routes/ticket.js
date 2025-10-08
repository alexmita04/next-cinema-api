const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket");
const { authenticate, isUser } = require("../middlewares/auth");

router
  .route("/create-checkout-session")
  .post(authenticate, isUser, ticketController.createCheckoutSession);

router.route("/session-status/:sessionId").get(ticketController.sessionStatus);

module.exports = router;

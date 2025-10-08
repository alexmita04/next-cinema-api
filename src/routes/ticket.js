const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket");

router
  .route("create-checkout-session")
  .post(ticketController.createCheckoutSession);

router.route("/session-status/:sessionId").get(ticketController.sessionStatus);

module.exports = router;

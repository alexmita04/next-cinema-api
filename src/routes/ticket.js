const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket");
const { authenticate, isUser } = require("../middlewares/auth");

/**
 * @swagger
 * /api/tickets/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session for ticket purchase
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User role required
 */
router
  .route("/create-checkout-session")
  .post(authenticate, isUser, ticketController.createCheckoutSession);

/**
 * @swagger
 * /api/tickets/session-status/{sessionId}:
 *   get:
 *     summary: Get the status of a checkout session
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Stripe session ID
 *     responses:
 *       200:
 *         description: Session status retrieved successfully
 *       404:
 *         description: Session not found
 */
router.route("/session-status/:sessionId").get(ticketController.sessionStatus);

router
  .route("/screenings/:screeningId")
  .get(ticketController.getTicketsForSpecificScreening);

module.exports = router;

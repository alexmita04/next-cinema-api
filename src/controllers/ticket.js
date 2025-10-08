const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Ticket = require("../models/ticket");
const Joi = require("joi");
const { ticketSchema } = require("../utils/joiSchemas");

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = require("stripe")(
  "sk_test_51SFH3gRElVTmok8XjZNAbx4RMyJE0j0f6sZkHfP7TwLayKAl5ASRnnqf7NCfJokr2y82h0PawUljFXjeHm58ELUx00bi5bPQWg",
  {
    apiVersion: "2025-03-31.basil",
  }
);

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const { totalPrice, screeningId, userId, seat, pricingCategory } = req.body;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Cinema ticket(s)",
          },
          unit_amount: totalPrice,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    ui_mode: "embedded",
    return_url: "https://example.com/return?session_id={CHECKOUT_SESSION_ID}", // to be edited
    metadata: {
      totalPrice,
      screeningId,
      userId,
      seatRow: seat.row,
      seatNumber: seat.number,
      pricingCategory,
    },
  });

  res.json({
    status: "success",
    data: {
      clientSecret: session.client_secret,
    },
  });
});

exports.webhookHandler = catchAsync(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.log(err);
    return next(new ExpressError("Stripe Webhook Error", 400));
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const {
        totalPrice,
        screeningId,
        userId,
        pricingCategory,
        seatRow,
        seatNumber,
      } = session.metadata;

      try {
        Joi.assert(
          {
            totalPrice,
            screening: screeningId,
            customer: userId,
            pricingCategory,
            seat: { row: seatRow, number: seatNumber },
          },
          ticketSchema
        );
      } catch (err) {
        return next(new ExpressError("Ticket validation failed", 400));
      }

      const newTicket = new Ticket({
        totalPrice,
        screening: screeningId,
        customer: userId,
        seat: {
          row: seatRow,
          number: seatNumber,
        },
        pricingCategory,
      });

      await newTicket.save();

      break;
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      break;
    case "payment_intent.payment_failed":
      const failedPayment = event.data.object;
      return next(new ExpressError("Payment failed", 402));
      break;
    default:
    //   console.log(`Unhandled event type ${event.type}`);
  }

  res.json({
    status: "success",
  });
});

exports.sessionStatus = catchAsync(async (req, res, next) => {
  const { sessionId } = req.params;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    return next(
      new ExpressError("No checkout session found with this id", 404)
    );
  }

  res.json({
    status: "success",
    data: {
      session,
    },
  });
});

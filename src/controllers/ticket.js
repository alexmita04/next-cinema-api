const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Ticket = require("../models/ticket");
const Joi = require("joi");
const { ticketSchema } = require("../utils/joiSchemas");

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  //   const { totalPrice, screeningId, userId, seat, pricingCategory } = req.body;

  const { tickets } = req.body;
  const ticketsCounter = tickets.length;

  if (ticketsCounter <= 0)
    return next(new ExpressError("Invalid number of tickets", 400));

  let totalPrice = 0;
  for (let ticket of tickets) {
    totalPrice += ticket.totalPrice;
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Cinema ticket(s)",
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    ui_mode: "embedded",
    return_url: process.env.RETURN_TO_STRIPE, // to be edited
    // metadata: {
    //   totalPrice,
    //   screeningId,
    //   userId,
    //   seatRow: seat.row,
    //   seatNumber: seat.number,
    //   pricingCategory,
    // },
    metadata: {
      tickets: JSON.stringify(tickets),
      ticketsCounter: JSON.stringify(ticketsCounter),
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
      //   const {
      //     totalPrice,
      //     screeningId,
      //     userId,
      //     pricingCategory,
      //     seatRow,
      //     seatNumber,
      //   } = session.metadata;

      const { stringTickets, ticketsCounter } = session.metadata;
      const tickets = JSON.parse(stringTickets);
      const fullFilledTickets = [];

      for (const ticket of tickets) {
        try {
          const {
            totalPrice,
            screeningId,
            userId,
            pricingCategory,
            seatRow,
            seatNumber,
          } = ticket;

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

          fullFilledTickets.push(newTicket);
        } catch (err) {
          return next(new ExpressError("Ticket validation failed", 400));
        }
      }

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
    data: {
      fullFilledTickets,
      length: fullFilledTickets.length,
    },
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

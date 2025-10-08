const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const stripe = require("stripe")(
  "sk_test_51SFH3gRElVTmok8XjZNAbx4RMyJE0j0f6sZkHfP7TwLayKAl5ASRnnqf7NCfJokr2y82h0PawUljFXjeHm58ELUx00bi5bPQWg",
  {
    apiVersion: "2025-03-31.basil",
  }
);

exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  const { totalPrice } = req.body;

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

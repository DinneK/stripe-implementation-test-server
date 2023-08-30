const app = require("express")();
const cors = require("cors");

require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

const coupon = await stripe.coupons.create({
  percent_off: 25,
  duration: "once",
});

const promotionCode = await stripe.promotionCodes.create({
  coupon: "{{COUPON_ID}}",
  code: "VIPCODE",
});

app.use(cors());

app.get("/api", (_, res) => {
  res.send("Success");
});

app.get("/api/config", (_, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: 2000,
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

module.exports = app;

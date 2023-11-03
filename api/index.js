const app = require("express")();
const cors = require("cors");
var bodyParser = require("body-parser");

require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

const { calculateDiscount } = require("../promoCodeLogic");

app.use(cors());

app.use(bodyParser.json());

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
    const { promoCode } = req.body;
    const discountAmount = calculateDiscount(promoCode);

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: 2000 - discountAmount,
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

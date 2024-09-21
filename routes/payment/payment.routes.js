const express = require("express");
const router = express.Router();
const ShoppingCart = require("../../models/ShoppingCart.js");
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);
const moment = require("moment/moment.js");

//models
const User = require("../../models/User.js");
const Offer = require("../../models/Offer.js");
const Transactions = require("../../models/Transactions.js");

router.post("/payment", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route /payment");
  const { product_title, amount, product_id, product_price, buyer_token } =
    req.body;
  // console.log(
  //   "product_title in /payment",
  //   product_title,
  //   "\n",
  //   "amount in /payment:",
  //   amount,
  //   "\n",
  //   "product_price in /payment:",
  //   product_price,
  //   "\n",
  //   "product_id in /payment:",
  //   product_id,
  //   "\n",
  //   "buyer_token in /payment:",
  //   buyer_token
  // );
  if (product_title && amount && product_id !== undefined) {
    const offers = await Offer.findById(product_id);
    // console.log("offers in /payment:", offers);
    // console.log("offers.product_price in /payment:", offers.product_price);
    if (product_price === Number(offers.product_price).toFixed(2)) {
      // console.log(
      //   "Number(offers.product_price).toFixed(2) in /payment:",
      //   Number(offers.product_price).toFixed(2)
      // );
      console.log("product_price /payment", product_price);
      // console.log("product_price === Number(offers.product_price).toFixed(2)");
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          //montant transaction
          amount: amount,
          currency: "eur",
          description: product_title,
        });
        // console.log("paymentIntent in /payment:", paymentIntent);
        if (paymentIntent.client_secret) {
          // console.log(
          //   "paymentIntent.client_secret in /payment:",
          //   paymentIntent.client_secret
          // );
          const date = moment.locale().format("l");
          console.log("date in /payment:", date);
          console.log("typeof date in /payment:", typeof date);
          const seller = await User.findById(offers.owner);
          // console.log("seller in /payment:", seller);
          const buyer = await User.findById(req.user._id);
          // console.log("buyer in /payment:", buyer);
          const newTransactions = new Transactions({
            product_name: offers.product_name,
            product_price: product_price,
            seller: {
              email: seller.email,
              account: seller.account,
              _id: seller._id,
            },
            buyer: {
              email: buyer.email,
              account: buyer.account,
              _id: buyer._id,
            },
            product_id: offers.product_id,
            date: date,
          });
          // console.log("newTransactions in /payment:", newTransactions);
          await newTransactions.save();
          const offerSolded = Offer.findByIdAndUpdate(offers._id, {
            offer_solded: true,
          });
          res.status(200).json(paymentIntent);
        } else {
          res.status(400).json({ message: error.message });
        }
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } else {
    res.status(400).json({ message: "oups, something went wrong" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../../models/User.js");
const Offer = require("../../models/Offer.js");
const ShoppingCart = require("../../models/ShoppingCart.js");
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);

router.post("/payment", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route /payment");
  const { product_title, amount, product_id, product_price, buyer_token } =
    req.body;
  console.log(
    "product_title in /payment",
    product_title,
    "\n",
    "amount in /payment:",
    amount,
    "\n",
    "product_price in /payment:",
    product_price,
    "\n",
    "product_id in /payment:",
    product_id,
    "\n",
    "buyer_token in /payment:",
    buyer_token
  );
  if (product_title && amount && product_id !== undefined) {
    const offers = await Offer.findById(product_id);
    // console.log("offers in /payment:", offers);
    // console.log("offers.product_price in /payment:", offers.product_price);
    if (product_price === Number(offers.product_price).toFixed(2)) {
      console.log(
        "Number(offers.product_price).toFixed(2) in /payment:",
        Number(offers.product_price).toFixed(2)
      );
      console.log("product_price", product_price);
      // console.log("product_price === Number(offers.product_price).toFixed(2)");
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          //montant transaction
          amount: amount,
          currency: "eur",
          description: product_title,
        });
        console.log("paymentIntent in /payment:", paymentIntent);
        res.status(200).json(paymentIntent);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
    // try {
    //   const paymentIntent = await stripe.paymentIntents.create({
    //     //mopntant transaction
    //     amount: req.body ?? formData,
    //     currency: "eur",
    //     //description product
    //     // description: req.body.description ?? formData,
    //   });

    //   if (offers !== undefined) {
    //     const userId = offers.owner;
    //     console.log("userId in /payment:", userId);
    //     const ownerFind = await User.findById(userId).select("account");
    //     console.log("ownerFind in /payment:", ownerFind);
    //     const newShoppingCart = new ShoppingCart({
    //       product_name: offers.product_name,
    //       product_price: offers.product_price,
    //       product_id: offers._id,
    //       Seller: ownerFind,
    //     });
    //     await newShoppingCart.save();
    //     return res.status(200).json({
    //       offers: {
    //         product_name: offers.product_name,
    //         product_price: offers.product_price,
    //         product_image: offers.product_image,
    //         product_pictures: offers.product_pictures,
    //         owner: ownerFind,
    //       },
    //     });
    //   }
    // } catch {
    //   res.status(500).json({ message: error.message });
    // }
  } else {
    res.status(400).json({ message: "oups, something went wrong" });
  }
});

module.exports = router;

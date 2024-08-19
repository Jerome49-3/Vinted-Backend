const express = require("express");
const router = express.Router();
const User = require("../../models/User.js");
const Offer = require("../../models/Offer.js");
const ShoppingCart = require("../../models/ShoppingCart.js");
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../../middleware/isAuthenticated.js");

router.post(
  "/shoppingCart",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    // console.log("Je suis sur la route /shoppingCart");
    const { objId } = req.body;
    // console.log("objId in /shoppingCart", objId);
    if (objId !== undefined) {
      const offers = await Offer.findById(objId);
      // console.log("offers in /shoppingCart:", offers);
      if (offers !== undefined) {
        const userId = offers.owner;
        // console.log("userId in /offers/:id:", userId);
        const ownerFind = await User.findById(userId).select("account");
        // console.log("ownerFind in /shoppingCart:", ownerFind);
        const newShoppingCart = new ShoppingCart({
          product_name: offers.product_name,
          product_price: offers.product_price,
          product_id: offers._id,
          owner: ownerFind,
        });
        await newShoppingCart.save();
        return res.status(200).json({
          offers: {
            product_name: offers.product_name,
            product_price: offers.product_price,
            product_image: offers.product_image,
            product_pictures: offers.product_pictures,
            owner: ownerFind,
          },
        });
      }
    }
    res.status(200).json({ message: "objId ok" });
    try {
    } catch (error) {
      console.log("error:", error);
    }
  }
);

module.exports = router;

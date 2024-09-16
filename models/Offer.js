const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  product_name: {
    type: String,
    maxLength: 50,
    required: true,
  },
  product_description: {
    type: String,
    maxLength: 500,
    required: true,
  },
  product_price: {
    type: Number,
    max: 100000,
    required: true,
  },
  product_details: Array,
  product_image: Object,
  product_pictures: Array,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Offer_solded: Boolean,
  date: {
    type: Date,
  },
});
module.exports = Offer;

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
  product_nameImg: String,
  product_pictures: Array,
  product_namePics: Array,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = Offer;

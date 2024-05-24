const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Offer = require('../../models/Offer')

router.get('/offer', async (req, res) => {
  // console.log('je suis sur la route /offers')
  const {
    title,
    priceMin,
    priceMax,
    sort,
    page
  } = req.query
  try {
    if (!req.query) {
      const getOffer = await Offer.find().select("product_name product_price -_id");
      res.status(200).json({ getOffer, message: "getofferok" })
    }
    else {
      const filter = {};
      let select = "";
      let limitNum = 0;
      let skipNum = 0;
      let filterSort = {};
      select = "product_name product_price -_id"
      // console.log('page:', page)
      if (title) {
        filter.product_name = new RegExp(title, "i");
      }
      //si page est différend de undefined et strictement supérieur à 0
      if (page !== undefined || page !== 0) {
        limitNum = 3;
        skipPage = page - 1;
        skipNum = skipPage * limitNum;
        // console.log('skipPage', skipPage, 'skipNum:', skipNum, 'limitNum:', limitNum)
      }
      if (priceMin !== undefined) {
        sortFilter = { product_price: { $gte: priceMin } }
      }
      if (priceMax !== undefined) {
        sortFilter = { product_price: { $lte: priceMax } }
      }
      if (sort === "price-desc") {
        sortFilter = { product_price: -1 }
        console.log("price-desc:", sortFilter);
      }
      if (sort === "price-asc") {
        sortFilter = { product_price: 1 }
        console.log("price-asc:", sortFilter);
      }
      const getOffer = await Offer.find(filter).sort(filterSort).limit(limitNum).skip(skipNum).select(select);
      res.status(200).json({ getOffer, message: "getofferok" })
    }
  } catch (error) {
    console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
    return res.status(500).json({ error: error.message })
  }
});

//   else {
//       try {
//         const offersName = await Offer.find({ product_name: regexName }).select("product_name product_price -_id")
//         return res.status(200).json({ offersName })
//       } catch (error) {
//         console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//         return res.status(400).json({ error: 'bad request' })
//       }
//     }
//         const getOffer = await Offer.find(filter).select("product_name product_price -_id");
//         res.status(200).json({ getOffer, message: "getofferok" });
//       }
//     } catch (error) {
// console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
// return res.status(500).json({ error: error.message })
//     }

//     res.status(200).json({ getOffer, message: "getofferok" })
//     if (page) {
//       if (page === 1) {
//         const getOffer = await Offer.find().select("product_name product_price -_id").limit(3).skip(0);
//         res.status(200).json({ getOffer, message: "resultat page 1" })
//       }
//       if (page === 2) {
//         const getOffer = await Offer.find().select("product_name product_price -_id").limit(3).skip(3);
//         res.status(200).json({ getOffer, message: "resultat page 2" })
//       }
//     }

//     if (title && sort === "price-asc") {
//       const offersNameSortAsc = await Offer.find({ product_name: regexName }).sort({ product_price: 1 }).select("product_name product_price -_id")
//       return res.status(200).json({ offersNameSortAsc })
//     }
//     if (title && sort === "price-desc") {
//       const offersNameSortDesc = await Offer.find({ product_name: regexName }).sort({ product_price: -1 }).select("product_name product_price -_id")
//       return res.status(200).json({ offersNameSortDesc })
//     }
//     if (priceMin || priceMax || priceMin && priceMax) {
//       if (priceMin) {
//         try {
//           const offersPrice = await Offer.find({ product_price: { $gte: priceMin } }).select("product_name product_price -_id")
//           return res.status(200).json({ offersPrice })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//       else if (priceMax) {
//         try {
//           const offersPrice = await Offer.find({ product_price: { $lte: priceMax } }).select("product_name product_price -_id")
//           return res.status(200).json({ offersPrice })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//       else if (priceMin && priceMax) {
//         try {
//           const offersPrice = await Offer.find({ product_price: { $gte: priceMin, $lte: priceMax } }).select("product_name product_price -_id")
//           return res.status(200).json({ offersPrice })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//     }
//     if (sort) {
//       if (sort === "price-desc") {
//         try {
//           const offersSortDesc = await Offer.find().sort({ product_price: -1 }).select("product_name product_price -_id")
//           return res.status(200).json({ offersSortDesc })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//       else if (sort === "price-desc" && page === 1) {
//         try {
//           const offersSortAsc = await Offer.find().sort({ product_price: -1 }).limit(3).skip(0).select("product_name product_price -_id")
//           return res.status(200).json({ offersSortAsc })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//       else if (sort === "price-desc" && page === 2) {
//         try {
//           const offersSortAsc = await Offer.find().sort({ product_price: -1 }).limit(3).skip(3).select("product_name product_price -_id")
//           return res.status(200).json({ offersSortAsc })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//       else if (sort === "price-asc") {
//         try {
//           const offersSortAsc = await Offer.find().sort({ product_price: 1 }).select("product_name product_price -_id")
//           return res.status(200).json({ offersSortAsc })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//       else if (sort === "price-asc" && page === 1) {
//         try {
//           const offersSortAsc = await Offer.find().sort({ product_price: 1 }).limit(3).skip(0).select("product_name product_price -_id")
//           return res.status(200).json({ offersSortAsc })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//       else if (sort === "price-asc" && page === 2) {
//         try {
//           const offersSortAsc = await Offer.find().sort({ product_price: 1 }).limit(3).skip(3).select("product_name product_price -_id")
//           return res.status(200).json({ offersSortAsc })
//         } catch (error) {
//           console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
//           return res.status(400).json({ error: 'bad request' })
//         }
//       }
//     }
//   }


router.get('/offer/:id', async (req, res) => {
  console.log('je suis sur la route /offers/:id')
  const offerId = req.params.id;
  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  console.log('offerIdIsValid:', offerIdIsValid)
  if (offerId !== undefined && offerIdIsValid !== false) {
    try {
      const offerObj = await Offer.findById(offerId);
      // console.log('offerId:', offerId)
      console.log('offerId:', offerObj)
      if (offerObj) {
        return res.status(200).json({ offerObj, message: "voila l'article souhaité" })
      }
    } catch (error) {
      console.log('error:', error, '\n', 'error.message:', error.message, '\n', 'error.message:', error.message);
      return res.status(500).json({ error: error.message })
    }
  }
  else {
    return res.status(400).json({ message: "bad request" })
  }
})

module.exports = router
router.post("/payment", async (req, res) => {
  try {
    const payment = await Stripe.payment.create({
      //mopntant transaction
      amount: req.body ?? formData,
      currency: "eur",
      //description product
      description: req.body.description ?? formData,
    });
  } catch {
    res.status(200).json(payment);
  }
});

module.exports = Router;

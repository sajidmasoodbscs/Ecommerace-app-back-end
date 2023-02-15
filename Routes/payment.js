const router =require("express").Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




router.post("/payment",async(req,res)=>{

var chargeObject = {};
chargeObject.amount = req.body.amount;
chargeObject.currency = "usd";
chargeObject.source =req.body.tokenId ;
chargeObject.description = "Charge for joe@blow.com";

stripe.charges.create(chargeObject)
.then((charge) => {
    // New charge created. record charge object
    res.status(200).json(charge);
    console.log("stripe Res is ",charge)
}).catch((err) => {
    // charge failed. Alert user that charge failed somehow

        switch (err.type) {
          case 'StripeCardError':
            // A declined card error
            // => e.g. "Your card's expiration year is invalid."
            console.log("error is ",err.message)
             res.status(500).json(err.message);
            break;
          case 'StripeInvalidRequestError':
            // Invalid parameters were supplied to Stripe's API
            console.log("error is ",err.message)
            res.status(500).json(err.message);
            break;
          case 'StripeAPIError':
            // An error occurred internally with Stripe's API
            console.log("error is ",err.message)
            res.status(500).json(err.message);
            break;
          case 'StripeConnectionError':
            // Some kind of error occurred during the HTTPS communication
            console.log("error is ",err.message)
            res.status(500).json(err.message);
            break;
          case 'StripeAuthenticationError':
            // You probably used an incorrect API key
            console.log("error is ",err.message)
            res.status(500).json(err.message);
            break;
          case 'StripeRateLimitError':
            // Too many requests hit the API too quickly
            console.log("error is ",err.message)
            res.status(500).json(err.message);

            break;
        }
});     
}
)

module.exports=router;
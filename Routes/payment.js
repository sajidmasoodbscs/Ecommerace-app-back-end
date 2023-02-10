const router =require("express").Router();
const stripe = require('stripe')(process.envSTR_KEY);




router.post("/payment",async(req,res)=>{
    const charge = await stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: 'usd',
        description: 'My First Test Charge (created for API docs at https://www.stripe.com/docs/api)',
      });
},
(stripeErr,stripeRes)=>{

    if (stripeErr) {
        res.status(500).json(stripeErr);
        console.log("error is ",stripeErr)
    }else{
        res.status(200).json(stripeRes);
        console.log("stripe Res is ",stripeRes)
    }
}
)

module.exports=router;
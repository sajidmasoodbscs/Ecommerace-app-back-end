const router =require("express").Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => { 

    // console.log("Request body is: ",req.body)

    const {product} = req.body; 


    console.log("Request body is: ",product)
    try {
        const session = await stripe.checkout.sessions.create({ 
            payment_method_types: ["card"], 
            line_items: [ 
              { 
                price_data: { 
                  currency: "inr", 
                  product_data: { 
                    name: product.name, 
                  }, 
                  unit_amount: product.price * 100, 
                }, 
                quantity: product.quantity, 
              }, 
            ], 
            mode: "payment", 
            success_url: "http://localhost:3000/success", 
            cancel_url: "http://localhost:3000/cancel", 
          }); 
          res.json({ id: session.id }); 
    } catch (error) {
        console.log("Error is : ",error);
        res.status(500).send(error); 

    }
   
  }); 

  module.exports=router;
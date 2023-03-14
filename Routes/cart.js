const {
    verifyTokenAndAuthentication,
    verifyTokenAndAdmin,
    verifyToken,
  } = require("./varifytoken");
  
  const router = require("express").Router();
  const Cart = require("../Models/Cart");
  const User = require("../Models/User");
  const reqMethod=require("./requestMethod")

    
  // CREATE CART
  router.post("/addcart",reqMethod,verifyToken, async (req, res) => {
    console.log("We are inside add new cart function.");
    const cartData = new Cart(req.body);
  
    try {
      const newCart = await cartData.save();
      console.log(
        `New cart is added successfully : `,
        newCart
      );
      res
        .status(200)
        .json({
          Message: `New cart is added successfully :`,
          Cart: newCart,
        });
    } catch (error) {
      console.log("Error is : ", error);
      res.status(500).json(error);
    }
  });
  
  router.put("/updatecart/:id",reqMethod,verifyTokenAndAuthentication, async (req, res) => {
    console.log("We are inside update cart function.");
  
    try {  
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
  
      console.log(
        `Cart is updated sucessfully: `,
        updatedCart
      );
      res
        .status(200)
        .json({
          Message: `Cart is updated sucessfully`,
          Cart: updatedCart,
        });
    } catch (error) {
      console.log("Error is : ", error);
      res.status(500).json(error);
    }
  });
  
  router.delete("/deletecart/:id",reqMethod, verifyTokenAndAuthentication, async (req, res) => {
    try {
      console.log("Here we are inside delete  cart function");
      const deleteRequired = await Cart.findById(req.params.id);
  
      if (deleteRequired) {
        Cart.findOneAndDelete(req.params.id)
          .then((result) => {
            console.log("Result of deletion : ", result);
            res
              .status(200)
              .json(`Cart has been deleted successfully`);
          })
          .catch((err) => {
            console.log("Error in product deletion : ", err);
            res.status(200).json(err);
          });
      } else {
        console.log("no cart found");
        res.status(404).json("no cart found");
      }
    } catch (error) {
      console.log("Error in deletion : ", error);
      res.status(500).json("Erros in deletion");
    }
  });
  
  router.get("/findcart/:userid", reqMethod, verifyTokenAndAuthentication, async (req, res) => {
    try {
      //  console.log(`Welcome Mr ${req.user.name}. Please wait we are fetching data for you.....`)
  
      const resultCart = await Cart.findOne({userId:req.params.userid});
  
      if (resultCart) {
        res.status(200).json(resultCart);
      } else {
        res.status(200).json("No cart found");
      }
    } catch (error) {
      console.log("Error is fetching product : ", error);
      res.status(500).json({ Error: error.toString() });
    }
  });
  
  router.get("/allcart", reqMethod, verifyTokenAndAdmin, async (req, res) => {
    try {
      
        const Carts=await Cart.find({});
        if (Carts) {
            res.status(200).json(Carts);
        }else{
            res.status(200).json("No cart found");
        }
    } catch (error) {
      console.log("Error is fetching products : ", error);
      res.status(500).json({ Error: error.toString() });
    }
  });
  
  
  module.exports = router;
  
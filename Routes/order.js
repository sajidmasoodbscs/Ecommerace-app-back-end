const router = require("express").Router();
const orders=require("../Models/Order")
const Order = require("../Models/Order");
const User = require("../Models/User");
const reqMethod=require("./requestMethod")

const {
  verifyTokenAndAuthentication,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./varifytoken"); 




  
    
  // CREATE CART
  router.post("/addorder",reqMethod, verifyToken, async (req, res) => {
    console.log("We are inside add new order function.");
    const orderData = new Order(req.body);
  
    try {
      const newOrder = await orderData.save();
      console.log(
        `New order is added successfully : `,
        newOrder
      );
      res
        .status(200)
        .json({
          Message: `New order is added successfully :`,
          Order: newOrder,
        });
    } catch (error) {
      console.log("Error is : ", error);
      res.status(500).json(error);
    }
  });
  
  router.put("/updateorder/:id", reqMethod, verifyTokenAndAdmin, async (req, res) => {
    console.log("We are inside update cart function.");
  
    try {  
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
  
      console.log(
        `Cart is updated sucessfully: `,
        updatedOrder
      );
      res
        .status(200)
        .json({
          Message: `Cart is updated sucessfully`,
          Updated_Order: updatedOrder,
        });
    } catch (error) {
      console.log("Error is : ", error);
      res.status(500).json(error);
    }
  });
  
  router.delete("/deleteorder/:id", reqMethod, verifyTokenAndAdmin, async (req, res) => {
    try {
      console.log("Here we are inside delete  cart function");
      const deleteRequired = await Order.findById(req.params.id);
  
      if (deleteRequired) {
        Order.findOneAndDelete(req.params.id)
          .then((result) => {
            console.log("Result of Order deletion : ", result);
            res
              .status(200)
              .json(`Order has been deleted successfully`);
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
  
  router.get("/find/:userid", reqMethod, verifyTokenAndAuthentication, async (req, res) => {
    try {
      //  console.log(`Welcome Mr ${req.user.name}. Please wait we are fetching data for you.....`)
  
      const resultOrder = await Order.findOne({userId:req.params.userid});
  
      if (resultOrder) {
        res.status(200).json(resultOrder);
      } else {
        res.status(200).json("No cart found");
      }
    } catch (error) {
      console.log("Error is fetching product : ", error);
      res.status(500).json({ Error: error.toString() });
    }
  });
  
  router.get("/allorders", reqMethod, verifyTokenAndAdmin, async (req, res) => {
    try {
      
        const Orders=await Order.find({});
        if (Orders) {
            res.status(200).json(Orders);
        }else{
            res.status(200).json("No cart found");
        }
    } catch (error) {
      console.log("Error is fetching products : ", error);
      res.status(500).json({ Error: error.toString() });
    }
  });


  router.get("/salesreport", reqMethod, verifyTokenAndAdmin, async (req, res) => {
    try {
      
        let date=new Date();

        let lastMonth=new Date(date.setMonth(date.getMonth()-1));

        let previousMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1));

        console.log("previousMonth",previousMonth);


        const Orders = await Order.aggregate();

        if (Orders) {
            res.status(200).json(Orders);
        }else{
            res.status(200).json("No cart found");
        }
    } catch (error) {
      console.log("Error is fetching products : ", error);
      res.status(500).json({ Error: error.toString() });
    }
  });
  
  
  module.exports = router;
  
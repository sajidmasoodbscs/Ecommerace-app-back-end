const {verifyTokenAndAuthentication,verifyTokenAndAdmin} = require("./varifytoken");

const router=require("express").Router();
const Product=require("../Models/Product");
const User=require("../Models/User");

const { findByIdAndDelete, findById } = require("../Models/User");


// CREATE PRODUCT
router.post("/add",verifyTokenAndAdmin,async(req,res)=>{
    console.log("We are inside create prodcut function.")
    const addedBy = await User.findById(req.user.id);
    console.log("product added by",addedBy.username);
    const prodcutData=new Product(req.body);

        try {
            const newProduct=await prodcutData.save();
            console.log(`New Product is added by ${addedBy.username} successfully : `,newProduct);
            res.status(200).json({Tile:`New Product is added by ${addedBy.username} successfully :`,Product:newProduct});
        } catch (error) {
            console.log("Error is : ",error)
            res.status(500).json(error);
        }
});


router.put("/:id",verifyTokenAndAuthentication,async(req,res)=>{

    console.log("We are inside update function.");
  
    if (req.body.password) {
        req.body.password=cryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString();
       }

        try {
            const newProduct=await Product.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true});

            console.log("User is updated and new user is : ",newProduct);
            res.status(200).json(newProduct);

        } catch (error) {
            console.log("Error is : ",error)
            res.status(500).json(error);
        }
});

router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try {
        console.log("Here we are inside delete function")
        const accessBy= await User.findById(req.user.id);
        const deleteRequired= await Product.findById(req.params.id);

        const removedBy=accessBy.username;
        const productTtitle=deleteRequired.title;

        console.log("Below product will be delete: " ,productTtitle);
        console.log("Product delete by: " ,removedBy)

        if (removedBy && deleteRequired)  {
            Product.findOneAndDelete(req.params.id).then((result)=>{
                console.log("Result of deletion : ",result)
                res.status(200).json(`Product ${productTtitle} has been deleted by ${removedBy}`)
            }).catch((err)=>{
                console.log("Error in product deletion : ",err);
                res.status(200).json(err)
            });
        }else{
            console.log("no product found");
            res.status(404).json("no usproducter found");
        }
    } catch (error) {
        console.log("Error in deletion : ",error);
        res.status(500).json("Erros in deletion");
    }
});

// router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
//     try {
 
//      console.log(`Welcome Mr ${req.user.name}. Please wait we are fetching data for you.....`)
 
//      const resultUser=await User.findById(req.params.id);
 
//      if (resultUser) {
//          res.status(200).json(resultUser);
//      }else{
//          res.status(200).json("No user found");
//      }
 
//     } catch (error) {
//      res.status(500).json({"Error":error});
//     }
     
//  });
 

// router.get("/",verifyTokenAndAdmin,async(req,res)=>{
//    try {
//     const query=req.query.limit
//     const users= query ? await User.find({}).sort({"createdAt":1}).limit(1): User.find({});

//     if (users) {
//         res.status(200).json(users);
//     }else{
//         res.status(200).json("No user found");
//     }

//    } catch (error) {
//     res.status(500).json({"Error":error});
//    }
    
// });

// router.get("/getstats",verifyTokenAndAdmin,async(req,res)=>{
    
//  console.log("We are inside stats function")
//         try{
//         const date=new Date();

//         const lastYear=new Date(date.setFullYear(date.getFullYear()-1))
//         console.log("Last Year : ",lastYear)

//            const  statsResult=await User.aggregate([
//             {$match:{createdAt:{$gte:lastYear}}},
//             {
//                 $project: {
//                     month: { $month: "$createdAt" },
//                   }
//             },
//             {
//                 $group:{
//                     _id:"$month",
//                     total:{
//                         $sum:1
//                     }
//                 }
//             }
//         ]);

        
//             if (statsResult) {
//                 console.log("Aggregation Result : ",statsResult)
//                 res.status(200).json(statsResult);
//             }else{
//                 console.log("Aggregation Result is empty")
//                 res.status(200).json("No user found");
//             }
        
//            }
//         catch (error) {
//             console.log("Aggregation Erros",error)

//             res.status(500).json({"Aggregation Erros : ":error});
//            }

//  });

module.exports = router;

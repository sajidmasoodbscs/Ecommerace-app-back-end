const {verifyToken,verifyTokenAndAuthentication,verifyTokenAndAdmin} = require("./varifytoken");

const router=require("express").Router();
const User=require("../Models/User");
const { findByIdAndDelete, findById } = require("../Models/User");

router.put("/:id",verifyTokenAndAuthentication,async(req,res)=>{

    console.log("We are inside update function.")
    if (req.body.password) {
        req.body.password=cryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString();
       }

        try {
            const newUser=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{new:true});

            console.log("User is updated and new user is : ",newUser);
            res.status(200).json(newUser);

        } catch (error) {
            console.log("Error is : ",error)
            res.status(500).json(error);
        }

});

router.delete("/:id",verifyTokenAndAdmin,async(req,res)=>{
    try {
        console.log("Here we are inside delete function")
        const accessBy= await User.findById(req.params.id);
        const delRequire= await User.find({"email":req.body.email});

        const removedBy=accessBy.username
        const removedUser=delRequire[0].username;

        console.log("This user will be delete: " ,delRequire);
        console.log("Remove user will be remove: " ,removedUser)


        if (removedUser) {

            User.findOneAndDelete({"email":req.body.email}).then((result)=>{
                console.log("Result of deletion : ",result)
            
                res.status(200).json(`User ${removedUser} has been deleted by ${removedBy}`)
            }).catch((err)=>{
                console.log("Error of deletion : ",err);
                res.status(200).json(err)
            });
        
        }else{
            console.log("no user found");
            res.status(401).json("no user found");

        }
    } catch (error) {
        console.log("Error in deletion : ",error);
        res.status(500).json("Erros in deletion");


    }
});

router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
    try {
 
     console.log(`Welcome Mr ${req.user.name}. Please wait we are fetching data for you.....`)
 
     const resultUser=await User.findById(req.params.id);
 
     if (resultUser) {
         res.status(200).json(resultUser);
     }else{
         res.status(200).json("No user found");
     }
 
    } catch (error) {
     res.status(500).json({"Error":error});
    }
     
 });
 

router.get("/",verifyTokenAndAdmin,async(req,res)=>{
   try {
    const query=req.query.limit
    const users= query ? await User.find({}).sort({"createdAt":1}).limit(1): User.find({});

    if (users) {
        res.status(200).json(users);
    }else{
        res.status(200).json("No user found");
    }

   } catch (error) {
    res.status(500).json({"Error":error});
   }
    
});

router.get("/getstats",verifyTokenAndAdmin,async(req,res)=>{
    
 console.log("We are inside stats function")
        try{
        const date=new Date();

        const lastYear=new Date(date.setFullYear(date.getFullYear()-1))
        console.log("Last Year : ",lastYear)

           const  statsResult=await User.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
                $project: {
                    month: { $month: "$createdAt" },
                  }
            },
            {
                $group:{
                    _id:"$month",
                    total:{
                        $sum:1
                    }
                }
            }
        ]);

        
            if (statsResult) {
                console.log("Aggregation Result : ",statsResult)
                res.status(200).json(statsResult);
            }else{
                console.log("Aggregation Result is empty")
                res.status(200).json("No user found");
            }
        
           }
        catch (error) {
            console.log("Aggregation Erros",error)

            res.status(500).json({"Aggregation Erros : ":error});
           }

 });

module.exports = router;

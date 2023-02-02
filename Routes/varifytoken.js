const jwt =require("jsonwebtoken");
const User = require("../Models/User");


const verifyToken= async (req,res,next)=>{
    const authToken=req.headers.token;

    console.log("Token from header is : ",authToken)

    if (authToken) {
        const token=authToken.split(" ")[1];

        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if (err) {
                res.status(401).json("Unauthorized access because token is invalid");
                console.log("Token is not valid",err)
            }else{
                console.log("Token validated and user is : ",user);
                req.user=user;
                next();
            }
        })

    }else{
        return res.status(500).json("Access token not found")
    }

}

const verifyTokenAndAuthentication=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }
        else{
            res.status(401).json("You are not alowed to do that!");
        }
    })
}

const verifyTokenAndAdmin=  (req,res,next)=>{
    verifyToken(req,res,async()=>{

    if (req.user.isAdmin) {
        console.log("User is admin")
        next();
    }
    else{
        console.log(`You are not admin.Please contact your admin support`)
        res.status(401).json(`You are not admin. Please contact your admin support.`);
    }     
    })
}

module.exports= {
    verifyToken,
    verifyTokenAndAuthentication,
    verifyTokenAndAdmin
};
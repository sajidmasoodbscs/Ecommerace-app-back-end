const jwt =require("jsonwebtoken");
const User = require("../Models/User");


const verifyToken= async (req,res,next)=>{

    console.log("Cookies are :",req.cookies);
    const token = req.cookies.access_token;
    if (!token) {
        console.log("Token not exsist")
        return res.sendStatus(403);
      }

      try {
        jwt.verify(token, process.env.JWT_SEC,(err,user)=>{
            if (err) {
                let errorReport={
                    "Error Name":err.name,
                    "Error Message":err.message
                }
                console.log("JWT Error Report -> : ",errorReport);
                
                res.status(401).json(errorReport);
            }else{
                console.log("Token validated and user is : ",user);
                req.user=user;
                return next();
            }
        });
    } catch(error) {
        console.log("Error in JWT token verification",error)
        return res.sendStatus(403);
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
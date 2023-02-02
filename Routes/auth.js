const router=require("express").Router()
const User=require("../Models/User")
const cryptoJS=require("crypto-js")
const jwt=require("jsonwebtoken");


router.post("/register",async(req,res)=>{

signupcheck(req.body.username,req.body.password,req.body.email).then(async(result)=>{

    if(result.isOK === true){

        const newUser=new User({
            username:req.body.username,
            password:cryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(),
            email:req.body.email
        });
        
        try{
            const savedUser=await newUser.save();
            console.log("User created")
            res.status(201).json(savedUser)
        }catch(error){
        console.log(error)
        res.status(500).json(error);
        }
    }
    else{
        console.log(result.error);
        res.status(400).send(result.error)
}

}).catch((err)=>{
    console.log("Response error",err)
});


console.log("We are inside of register new user function")

    

async function signupcheck (name,password,email) {

   const result={}
   const isOK=false;

const userExsist=await myCheckUser(email);

console.log("User fetched : ",userExsist);

    if(name){
        if(password){
            if (email) {
                result.isOK=true;
                return result 
            }
            else{
                result.error="email is required";
                result.isOK=false;
                return result 
            }
        }
        else{
            result.error="Password is required";
            result.isOK=false;
            return result
        }
    }
    else{
        result.error="username is required";
        result.isOK=false;
        return result
     }
}

function myCheckUser(email) {
    return new Promise( (resolve, reject) => {
        User.find({ "email": email }).then((doc)=>{
            // console.log(doc); // print out what it sends back
            resolve(doc);
        }).catch((error)=>{
            console.log("Not in docs",error);
            reject("Not found continue logic!")
        })
    }
    )
}


function logincheck(name,password) {

    const result={}
    const isOK=false;
     if(name){
         if(password){
             if (email) {
                 result.isOK=true;
                 return result 
             }
             else{
                 result.error="email is required";
                 result.isOK=false;
                 return result 
             }
         }
         else{
             result.error="Password is required";
             result.isOK=false;
             return result
         }
     }
     else{
         result.error="username is required";
         result.isOK=false;
         return result
      }
 }

});


router.post("/login",async(req,res)=>{

try {
    const user= await User.findOne({username:req.body.username});

    !user.username && res.status(400).json("User not found");

    console.log("Password is : ", req.body.password);

    const hashpassword=cryptoJS.AES.decrypt(user.password,process.env.PASS_SEC);
    const decode=hashpassword.toString(cryptoJS.enc.Utf8);

    console.log("Password aftre decode is : ", decode);


    decode !== req.body.password && res.status(400).json("wrong password");


    const {password,...other}=user._doc;

    const accessToken=jwt.sign(
        {
            id:user._id,
            isAdmin:user.isAdmin
        },
        process.env.JWT_SEC,
        {
            expiresIn:"2h"
        }
    )
    console.log("User login : ", user.username);
    res.status(200).json({...other,accessToken});

} catch (error) {
    res.status(500).json(error);
    console.log(error)
}    


})



module.exports = router;
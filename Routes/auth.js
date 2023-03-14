const router=require("express").Router()
const User=require("../Models/User")
const cryptoJS=require("crypto-js")
const jwt=require("jsonwebtoken");
const reqMethod=require("./requestMethod")


router.post("/register",reqMethod,async(req,res)=>{

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


router.post("/login",reqMethod,async(req,res)=>{

    console.log("Body is : ", req.body);


try {
    
    const { email } = req.body;
    const { password } = req.body;
    
    console.log("Emails is : ", email);
    console.log("Password is : ", password);
    if (!email || !password) {
       
          return res.status(400).json('Request missing email or password');
        }

    let user= await User.findOne({email:req.body.email});

    if (!user) {
        return res
          .status(400)
          .json('No user found by this email. Please Sign UP.');
      }


    const hashpassword=cryptoJS.AES.decrypt(user.password,process.env.PASS_SEC);
    const decode=hashpassword.toString(cryptoJS.enc.Utf8);

    console.log("Password aftre decode is : ", decode);

   if(decode !== req.body.password){
    return res.status(400).json("Wrong Password.");

   }else{
    user.password = undefined;
    user = JSON.parse(JSON.stringify(user));   
 
   const token=  jwt.sign(
         {
             id:user._id,
             isAdmin:user.isAdmin
         },
         process.env.JWT_SEC,
         {
             expiresIn:"2h"
         }
     );
 
     console.log("User login : ", user.username);
 
     return res
     .cookie("access_token", token, {
       httpOnly: true,
       secure: process.env.NODE_ENV !== "development",
     })
     .status(200)
     .json({ message: "Logged in successfully 😊 👌" });
   }


} catch (error) {
    res.status(500).json(error);
    console.log(error)
}    


})



module.exports = router;
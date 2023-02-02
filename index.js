const express=require("express")
const app =express();
const usertest=require("./Routes/user")
const db=require("./Config/dbConfig")
const authUser=require("./Routes/auth")
const User=require("./Routes/user")
const Product=require("./Routes/product")



app.use(express.json());



app.use("/api/auth",authUser);

app.use("/api/useradd",usertest);

app.use("/api/users",User);

app.use("/api/products",Product);


app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on host http://localhost:${process.env.PORT}`)
})



const express=require("express")
const app =express();
const usertest=require("./Routes/user")
const db=require("./Config/dbConfig")
const authUser=require("./Routes/auth")
const User=require("./Routes/user")
const Product=require("./Routes/product");
const Order=require("./Routes/Order");
const Cart=require("./Routes/cart");
const Payment=require("./Routes/payment");
const Paymentsession=require("./Routes/Paymentsession");
var cors = require('cors');
const cookies = require("cookie-parser");
var bodyParser = require('body-parser')

app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use(express.json());
app.use(cookies());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use("/api/auth",authUser);

app.use("/api/useradd",usertest);

app.use("/api/users",User);

app.use("/api/products",Product);

app.use("/api/orders",Order);
app.use("/api/cart",Cart);

app.use("/api/stripe",Payment);

app.use("/api/payment",Paymentsession);





app.listen(process.env.PORT,()=>{
    console.log(`Server is listening on host http://localhost:${process.env.PORT}`)
})



const mongoose=require("mongoose")

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

mongoose.connect(process.env.DBURL,options).then((result)=>{
    console.log("Database connected")
}).catch((error)=>{
    console.log("Database connection failed and erros is :"+error)
});
 

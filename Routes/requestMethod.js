const requestMethod= (req,res,next)=>{
    const requestMethods=[
        "OPTIONS",
    "HEAD",
    "CONNECT",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    ]

    if ( !requestMethods.includes(req.method)) {
        res.status(500).send(`${req.method} is not allowd`)
    }
    next();
}

module.exports=requestMethod;
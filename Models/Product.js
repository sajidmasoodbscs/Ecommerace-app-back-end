const mongoose=require("mongoose")


const ProductSchema=new mongoose.Schema(
    {
        title:{ type: String, unique:true, required: true},
        desc:{type:String,required:true},
        img:{type: String,required: true},
        catogries:{type:Array},
        color:{type:Array},
        size:{type:Array},
        price:{type:Number},
        instock:{type:Boolean , default: true}
    },
    {timestamps:true}
)

module.exports=mongoose.model("Product",ProductSchema)
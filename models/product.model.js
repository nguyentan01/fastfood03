const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    name:{type:String,required:true,default:"Bánh Tráng"},
    info:{type:String,default:"Rau siêu ngon"},
    price:{type:Number,default:20000},
    quantity:{type:Number,default:5},
    category:{type:mongoose.Schema.Types.ObjectId,ref:"category"}

},{timestamps:true})
module.exports=mongoose.model('product',productSchema)
const mongoose=require('mongoose')
const {Schema}=mongoose

const otpSchema=new Schema({
    email:{
        type:String,
        required:true,
     },
     otp:{
        type:String,
        required:true
     }
})


const otpModel=mongoose.model("userOTP",otpSchema)
module.exports=otpModel

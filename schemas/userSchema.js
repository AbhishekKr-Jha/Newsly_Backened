const mongoose =require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
 firstName:{
    type:String,
    required:true
 },
 lastName:{
   type:String,
   required:true
},
 email:{
    type:String,
    required:true,
    unique:[true,"email must be unique"]
 },
 contact:{
    type:Number,
    required:true,
    unique:[true,"email must be unique"]
 },
 interest:{
    type:[]
 },
 bookmarks:{
   type:[]
 },
 pw:{
    type:String,
    required:true   
 },
 cpw:{
   type:String,
   required:true   
}

});


const model=mongoose.model("userDetail",userSchema)

module.exports=model
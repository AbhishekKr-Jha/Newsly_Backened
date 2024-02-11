
const mongoose=require('mongoose')


   //   mongoose.connect("mongodb://localhost:27017/NewsOtiP_database",{
   //      useNewUrlParser: true,
   //      useUnifiedTopology: true
   //  }).then(()=>{
   //      console.log("connection successful")
   //   }).catch((err)=>{
   //      console.log("connection termnated due to _",err)
   //   })

   mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
      console.log("connection successful.....")
   }).catch((err)=>{
      console.log("connection termnated due to _",err)
   })
   
 

 
 

     
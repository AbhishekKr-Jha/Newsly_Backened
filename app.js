const dotenv=require('dotenv')
dotenv.config()
const express = require('express')
const cors=require('cors')

//dot env configuration


const app = express()

//database connection
require('./db/connection')

 
//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//cors connection
 const allowedOrigins = ['https://headlinehub1108.netlify.app','http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials:true,  
}));


//todo routes....
// const userRoutes=require('../routes/userRoutes')
const userRoutes=require('./routes/userRoutes')

app.use(userRoutes)



 
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World good! or say bad') 
})

app.listen(port, () => {
  console.log(`Example app listening on port https://localhost:${port}`)
})
const dotenv=require('dotenv')
dotenv.config()
const express = require('express')
const cors=require('cors')

//dot env configuration
console.log(process.env.USER_PASSWORD)

const app = express()

//database connection
require('./db/connection')

 
//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//cors connection
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins
}));


//todo routes....
const userRoutes=require('./routes/userRoutes')

app.use(userRoutes)




const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!') 
})

app.listen(port, () => {
  console.log(`Example app listening on port https://localhost:${port}`)
})
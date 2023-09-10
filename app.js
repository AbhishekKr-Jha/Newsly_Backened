require('dotenv').config()
const express = require('express')
const cors=require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins
}));


require('./db/connection')
//TODO schemas....
// const userSchema=require('./schemas/userSchema.js')
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
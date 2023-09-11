const express=require('express')
const router=express.Router()
const {registerUser, loginUser, allUsers, bookmarks, removeBookmarks, sendotp, getUserBookmarks} =require('../controllers/userControllers')



//TODO register......
router.post('/register',registerUser)

//todo login.....
router.post('/login',loginUser)

//todo sending otp
router.post('/sendotp',sendotp)

//todo all users.......
router.get('/allusers',allUsers)

//todo user add bookmarks......
router.post('/userBookmarks/:id',bookmarks)

//todo remove bookmarks......
router.delete('/removeBookmarks/:id',removeBookmarks)

//todo get  bookmarks......
router.post('/getBookmarks/:id',getUserBookmarks)




module.exports=router

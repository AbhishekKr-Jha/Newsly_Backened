const express=require('express')
const router=express.Router()
const {registerUser, loginUser, allUsers, bookmarks, removeBookmarks, sendotp, getUserBookmarks, updateUserDetails, getUser, verifyOtp} =require('../controllers/userControllers')



//TODO register......
router.post('/register',registerUser)

//todo login.....
router.post('/login',loginUser)

//todo sending otp
router.post('/sendotp',sendotp)

//todo verifying otp...
router.post('/verifyOtp',verifyOtp)

//todo all users.......
router.get('/allusers',allUsers)

//todo user add bookmarks......
router.post('/userBookmarks/:id',bookmarks)

//todo     remove bookmarks......
router.post('/removeBookmarks/:id',removeBookmarks)               

//todo   get  bookmarks of user......
router.post('/getBookmarks/:id',getUserBookmarks)

//todo    user details updation
router.put('/updateUserDetails/:id',updateUserDetails)

//todo user details
router.post('/getUser',getUser)

module.exports=router

const userModel = require('../schemas/userSchema.js')
const otpModel = require('../schemas/OtpSchema.js')
const nodeMailer = require('nodemailer')


const transporter = nodeMailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user:process.env.USER_EMAIL ,
      pass:process.env.USER_PASSWORD
    }
  });
  


//todo register.......
exports.registerUser = async (req, res) => {
    const { firstName, lastName, cpw, email, contact, pw, interest } = req.body
    try {

        if (!firstName || !lastName || !cpw || !email || !contact || !pw)
            res.send({
                message: "please enter all the fields",
                success: false
            })

        const userExist = await userModel.findOne({ email })
        if (userExist)
            res.send({
                message: "user with this  email already exists,please choose another",
                success: false
            })
if(pw==cpw){

        const user = new userModel(req.body)
        const savingUser = await user.save()
        res.send({
            message: "user registered successfully",
            success: true,
            savingUser,
        })
    }
    else{
        res.send({
    message:"password and confirm password does not match",
    success:false,
})
    }
    } catch (error) {
        console.log("Error occured dur to  __", error)
        res.send(error)

    }
}



//todo login............
exports.loginUser = async (req, res) => {
    const { email, pw } = req.body
    console.log(req.body)
    try {
        if (!email || !pw)
            return res.send({
                message: "please enter all the fields",
                success: false
            })

        const loginDetails = await userModel.findOne({ email, pw })
        if (!loginDetails)
            return res.send({
                message: "invalid credentials",
                success: false
            })

        return res.send({
            message: "login successful",
            success: true,
            loginDetails,
        })

    } catch (error) {
        console.log("Error occured dur to  __", error)
        res.send(error)
    }
}



//todo sending otp
exports.sendotp = async (req, res) => {
    const { email } = req.body
    console.log("email sfr.........")
    if (!email)
       return res.send({
            message: "please enter email fields",
            success: false
        })
    try {

        const otp = Math.floor(100000 + Math.random() * 900000);

        const previousOtp = await otpModel.findOne({ email })
        if (previousOtp) {
            const updateData = await otpModel.findOneAndUpdate({ email }, { otp }, { new: true })
            await updateData.save()

            const mailOptions = {
                from:'NewslyDigial@gmail.com',
                to: email,
                subject: "sending otp for verification",
                text: `OTP:${otp}`
            } 

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("sending email error is__", error)
                   return res.send({
                        message: "email sending was unsuccessful due to an error",
                        success: false
                    })
                }
                else {
                    console.log("email sent", info.response)
                return res.send({
                        message: "email sent successfully",
                        success: true
                    })
                }
            })
        }

        else {
            const newUserOtp = new otpModel({
                email, otp
            })
            await newUserOtp.save()

            const mailOptions = {
                from:'NewslyDigial@gmail.com',
                to: email,
                subject: "sending otp for verification",
                text: `OTP:${otp}`
            } 

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("sending email error is__", error)
                   return res.send({
                        message: "email sending was unsuccessful due to an error",
                        success: false
                    })
                }
                else {
                    console.log("email sent", info.response)
                   return res.send({
                        message: "email sent successfully",
                        success: true
                    })
                }
            })

        }
    } catch (error) {
        console.log("Error occured dur to  __", error)
       return res.send(error)
    }
}





//todo verifying OTP...
exports.verifyOtp=async(req,res)=>{
const {email,otp}=req.body
if(!email || !otp){
    return res.send({message:"please enter your otp"})
}
try {
    const otpVerification=await otpModel.findOne({email})
    if(otpVerification.otp==otp){
return res.json({
    message:"otp verification successful",
    success:true,
})
    }else{
        return res.json({
            message:"invalid otp",
            success:false,
        })
    }
} catch (error) {
    return res.send({message:"verification failed"})
}
}







//todo all the users
exports.allUsers = async (req, res) => {

    try {
        const allUsers = await userModel.find({})
        if (!allUsers)
            res.send({
                message: "No users registered yet",
                success: false
            })

        res.send({
            message: "all user details fetched",
            success: true,
            allUsers,
        })

    } catch (error) {
        console.log("Error occured dur to  __", error)
        res.send(error)
    }
}


//todo user add bookmarks           
exports.bookmarks = async (req, res) => {
    console.log("enter in backened")
    const data = req.body
    const { id } = req.params
    try {
        const userData = await userModel.findById(id)

        if (!userData) {
            console.log('User not found');
            return res.status(404).send({ message: 'User was not found' });
        }

        const addBookmarks = userData.bookmarks.push(data)
        console.log(addBookmarks)
        await userData.save()
        res.send({
            message: "bookmark saved successfully",
            success: true,
            userData
        })
    } catch (error) {
        console.log('Bookmark could not be saved:', error);
        res.status(500).send({ message: 'Bookmark could not be saved', error });
    }
}

//TODO Remove bookmsrks
exports.removeBookmarks = async (req, res) => {

    const data = req.body
    const {publishedAt} = data
    const { id } = req.params
    try {
        console.log(req,'fojiouhe')

        const delBookmark = await userModel.updateOne({ _id: id }, { $pull: { bookmarks:{'publishedAt':publishedAt} } }).exec()


        if (!delBookmark)
            res.send({
                message: "bookmark was not removed",
                success: false,
            })

        res.send({ 
            message: "bookmark of user from server removed successfully",
            success: true,
            delBookmark,
        })


    } catch (error) {
        console.log('Bookmark could not be removed:', error);
        res.status(500).send({ message: 'Bookmark could not be removed properly', error });
    }


}



//todo get Bookmarks of login User
exports.getUserBookmarks = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id)
        if (!user)
            return res.send({
                message: "user not present",
                success: false,
            })

        return res.json({
            message: "user present and bookmarks data available",
            success: true,
            bookmarks: user.bookmarks,
        })
    }
    catch (err) {
        res.send({
            message: "the error occured dure to", err
        })
    }
}


//todo update uder details
exports.updateUserDetails = async (req, res) => {
    const { firstName, lastName, contact } = req.body
    const { id } = req.params
    try {
        const userupdate_Data = await userModel.findByIdAndUpdate({ _id: id }, { firstName, lastName, contact }, { new: true }).exec()
        if (userupdate_Data) {
            await userupdate_Data.save()
            console.log("data updated succesfully")
            return res.json({ message: "data updated with new values", success: true, userupdate_Data })
        }
        return res.json({ message: "data can not be updated due to error", success: false })

    } catch (error) {
        res.json({ message: "data updation error" })
        console.log("errror ocured updation....")
        console.log(error)
    }
}

exports.getUser = async (req, res) => {

}
const userModel = require('../schemas/userSchema.js')
const otpModel = require('../schemas/OtpSchema.js')
const nodeMailer = require('nodemailer')


const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM',
        pass: 'REPLACE-WITH-YOUR-GENERATED-PASSWORD'
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


        const user = new userModel(req.body)
        const savingUser = await user.save()
        res.send({
            message: "user registered successfully",
            success: true,
            savingUser,
        })


    } catch (error) {
        console.log("Error occured dur to  __", error)
        res.send(error)

    }
}



//todo login............
exports.loginUser = async (req, res) => {
    const { email, pw } = req.body
    try {
        if (!email || !pw)
            res.send({
                message: "please enter all the fields",
                success: false
            })

        const loginDetails = await userModel.findOne({ email, pw })
        if (!loginDetails)
            res.send({
                message: "invalid credentials",
                success: false
            })

        res.send({
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
    const { email } = req.bidy
    try {
        if (!email)
            res.send({
                message: "please enter email fields",
                success: false
            })

        const userEmailexist = await userModel.findOne({ email })
        if (!userEmailexist)
            res.send({
                message: "invalid credentials,user not exist",
                success: false
            })

        const otp = Math.floor(100000 + Math.random() * 900000);

        const previousOtp = await otpModel.findOne({ email })
        if (previousOtp) {
            const updateData = await otpModel.findOneAndUpdate({ email }, { otp }, { new: true })
            await updateData.save()

            const mailOptions = {
                from: aj,
                to: email,
                subject: "sending otp for verification",
                text: `OTP:${otp}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("sending email error is__", error)
                    res.send({
                        message: "email sending was unsuccessful due to an error",
                        success: false
                    })
                }
                else {
                    console.log("email sent", info.response)
                    res.send({
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
                from: aj,
                to: email,
                subject: "sending otp for verification",
                text: `OTP:${otp}`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("sending email error is__", error)
                    res.send({
                        message: "email sending was unsuccessful due to an error",
                        success: false
                    })
                }
                else {
                    console.log("email sent", info.response)
                    res.send({
                        message: "email sent successfully",
                        success: true
                    })
                }
            })

        }
    } catch (error) {
        console.log("Error occured dur to  __", error)
        res.send(error)
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
    const data = req.body
    const { id } = req.params
    try {
        const userData = await userModel.findById(id)

        if (!userData) {
            console.log('User not found');
            return res.status(404).send({ message: 'User not found' });
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
    const { id } = req.params
    try {
        const delBookmark = await userModel.updateOne({ _id: id }, { $pull: { bookmarks: data } }).exec()


        if (delBookmark.ok)
            res.send({
                message: "bookmark was not removed",
                success: false,
            })

        res.send({
            message: "bookmark removed successfully",
            success: true,
            delBookmark
        })


    } catch (error) {
        console.log('Bookmark could not be saved:', error);
        res.status(500).send({ message: 'Bookmark could not be removed properly', error });
    }


}



//todo get Bookmarks of login User
exports.getUserBookmarks=async(req,res)=>{
try{
    const {id}=req.params
    const user=await userModel.findById(id)
    if (!user)
    return res.send({
message:"user not present" ,
success:false,  
 })

 return res.json({
    message:"user present and bookmarks data available",
    success:true,
    bookmarks:user.bookmarks,
 })
}
catch(err){
res.send({
    message:"the error occured dure to",err
})
}
}



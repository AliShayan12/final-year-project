const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");

//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is sample id",
            url: "profilepicUrl"
        }
    });

    // const token = user.getJWTToken();
    // res.status(201).json({
    //     success: true,
    //     token,
    // });


    sendToken(user, 201, res);


});


//Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    //checking email & password
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password", 400))
    }

    const user = await User.findOne({ email }).select("+password"); //we are writing password like this because we've used password = false in schema

    if (!user) {
        return next(new ErrorHander("Invalid Email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid Email or Password", 401));
    }

    // const token = user.getJWTToken();
    // res.status(200).json({
    //     success: true,
    //     token,
    // });

    sendToken(user, 200, res);
});

//Logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logged out",
    })
})


//forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHander("User not found", 404))
    }
    //get resetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it.`;


    try {

        await sendEmail({

            email: user.email,
            subject: `EquipRental Password Recovery`,
            message,

        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} Successfully`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHander(error.message, 500));

    }


})


// reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
        return next(new ErrorHander("Reset Password Token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);

})


//get user details (this is only accessed by a person who's logged in and it shows its own details)
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    })
})

//update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHander("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();
    sendToken(user, 200, res);
})


//update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
    })
})


//Get All users //this is for admin who can see the number of users
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        succes: true,
        users,
    })

})


//Get details of single user //this is for admin who can see the number of users
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User doesn not exist with id ${req.params.id}`)
        )
    }
    res.status(200).json({
        succes: true,
        user,
    })

})


//update user Role --admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    if (!user) {
        return next(
            new ErrorHander(`User doesn not exist with id ${req.params.id}`)
        )
    }
    res.status(200).json({
        success: true,
    })
})


//Delete a user  --admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHander(`User doesn not exist with id ${req.params.id}`)
        )
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    })
})


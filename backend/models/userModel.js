const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please Enter your name"],
        maxLength: [30, "Name can not exceed 30 charcters"],
        minLength: [4, "Name should have more than 4 characters"]
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },

    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false, //this mean when an admin asks for user details, password field will not be shown
    },

    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    role: {
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10); // to encrypt the password
});


//Json web Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { //this jwt_Secret key is used to login to this web app. Unauthorized Access to this key can harm the web app
        expiresIn: process.env.JWT_EXPIRE,
    })
}


//Compare password

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);

}

//Generating Password reset tokken
userSchema.methods.getResetPasswordToken = function () {

    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and add to resetPasswordtoken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

}
module.exports = mongoose.model("User", userSchema);
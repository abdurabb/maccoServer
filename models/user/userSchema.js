const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: [true, 'Email Already Exists']
    },
    gender: {
        type: String,
        required: [true, 'Email is Required'],
    },
    address: {
        type: String,
        required: [true, 'Address is Required']
    },
    qualification: {
        type: String,
        required: [true, 'Qualification is Required']
    },
    otpExpire: {
        type: Date
    },
    otp: {
        type: String
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User
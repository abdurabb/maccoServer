const { handleError } = require('../handler/handleError')
const User = require('../models/user/userSchema')
const { sendMail, InvalidEmailError, EmailSendError } = require("../handler/nodeMailer");
const { generateToken } = require("../handler/jwtGenerate");

const AddDetails = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) { return res.status(400).json({ success: false, message: 'Email is required.' }) }
        let isExist = await User.findOne({ email })
        if (isExist) { return res.status(400).json({ success: false, message: 'Email is Already Registered.' }) }
        const result = await sendMail(email);
        if (!result?.success) { return res.status(500).json({ success: false, message: 'Failed to send OTP.', error: result?.error }) }
        const otp = result?.otpCode;
        const expires = new Date(Date.now() + 3 * 60000);

        const user = await User.create({
            ...req?.body,
            otp,
            expires
        })

        return res.status(200).json({ message: 'Registration Completed, Please Verify Your OTP', user })
    } catch (error) {
        handleError(error, res)
    }
}


const sendOtp = async (req, res) => {
    try {
        const { email } = req?.body
        if (!email) { return res.status(400).json({ success: false, message: 'Email is required.' }) }
        let isExist = await User.findOne({ email })
        if (!isExist) { return res.status(400).json({ success: false, message: 'Email is not registered.' }) }
        const result = await sendMail(email);
        if (!result?.success) { return res.status(500).json({ success: false, message: 'Failed to send OTP.', error: result?.error }) }
        const otp = result?.otpCode;
        const expires = new Date(Date.now() + 3 * 60000);


        isExist.otp = otp
        isExist.otpExpire = expires
        isExist.isOtpVerified = false
        await isExist.save()
        isExist.otp = null
        return res.status(201).json({ success: true, message: 'OTP sent successfully.', user: isExist })
    } catch (error) {
        handleError(error, res)
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email } = req?.body
        if (!email) { return res.status(400).json({ success: false, message: 'Email is required.' }) }
        let isExist = await User.findOne({ email })
        if (!isExist) { return res.status(400).json({ success: false, message: 'Email is not registered.' }) }
        const { otp, otpExpire } = isExist
        if (otpExpire < Date.now()) { return res.status(400).json({ success: false, message: 'OTP expired.' }) }
        if (otp !== req?.body?.otp) { return res.status(400).json({ success: false, message: 'Invalid OTP.' }) }
        const token = generateToken(isExist?._id, "90d");
        isExist.otp = ""
        isExist.isOtpVerified = true
        await isExist.save()
        return res.status(200).json({ message: "OTP verified successfully", token, user: isExist })

    } catch (error) {
        handleError(error, res)
    }
}


module.exports = {
    AddDetails, sendOtp, verifyOtp
}
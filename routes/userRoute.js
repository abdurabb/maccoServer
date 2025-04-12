const express = require('express')
const router = express.Router()

const { AddDetails, verifyOtp, sendOtp } = require('../controller/auth')
const { protectUser } = require('../middleware/auth')
const { getHomeData } = require('../controller/home')


router.post('/add-details', AddDetails)
router.post('/verify-otp', verifyOtp)
router.post('/send-otp', sendOtp)

router.get('/get-home-data', protectUser, getHomeData)

module.exports = router
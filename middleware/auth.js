
const { verifyToken } = require('../handler/jwtGenerate');
const User = require('../models/user/userSchema')

const protectUser = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if (token) {
                const decoded = verifyToken(token);

                console.log(decoded.id)

                const user = await User.findById(decoded.id).select('-password');
                if (!user) {
                    return res.status(404).json({ status: false, message: 'user not found' });
                }
                
                if (user?.isOtpVerified == false) {
                    return res.status(400).json({ message: 'Otp Not Verified' })
                }

                req.user = user;
                req.userId = user?._id
                next();
            }
        } catch (error) {
            console.log(error)
            if (error.message == 'jwt expired') {
                return res.status(399).json({ status: false, message: 'Token expired' });
            } else {
                return res.status(403).json({ status: false, message: 'Invalid token' });
            }
        }
    }
    if (!token) {
        return res.status(401).json({ status: false, message: 'Token not found' });
    }
}


module.exports = {
    protectUser
}
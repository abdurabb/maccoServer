const { handleError } = require('../handler/handleError')

const getHomeData = async (req, res) => {
    try {
        
        return res.status(200).json({message:'User Data Fetched Successfully',user:req?.user})
    } catch (error) {
        handleError(error, res)
    }
}

module.exports = {
    getHomeData
}
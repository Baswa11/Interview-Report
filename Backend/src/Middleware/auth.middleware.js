const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../Models/blackList.model")

async function authUser(req, res, next) {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json({
                message: "Authentication token not provided."
            })
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Token has been invalidated. Please log in again."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        console.error("Auth middleware error:", err.message)
        return res.status(401).json({
            message: "Invalid or expired token."
        })
    }
}

module.exports = { authUser }
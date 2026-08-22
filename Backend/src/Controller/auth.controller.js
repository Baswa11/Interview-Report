const userModel = require("../Models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../Models/blackList.model")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const normalizedEmail = email.toLowerCase().trim()
        const normalizedUsername = username.trim()

        if (password.length < 4) {
            return res.status(400).json({
                message: "Password must be at least 4 characters long"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: isUserAlreadyExists.email === normalizedEmail 
                    ? "Account already exists with this email address" 
                    : "Username is already taken"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hash
        })

        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret_key"
        const token = jwt.sign(
            { id: user._id, username: user.username },
            jwtSecret,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.error("Register error:", err)
        res.status(500).json({ message: "Registration failed", error: err.message })
    }
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password"
            })
        }

        const normalizedEmail = email.toLowerCase().trim()

        const user = await userModel.findOne({ email: normalizedEmail })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret_key"
        const token = jwt.sign(
            { id: user._id, username: user.username },
            jwtSecret,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.error("Login error:", err)
        res.status(500).json({ message: "Login failed", error: err.message })
    }
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.replace("Bearer ", "")

        if (token) {
            try {
                await tokenBlacklistModel.create({ token })
            } catch (blacklistErr) {
                console.error("Blacklist token error:", blacklistErr)
            }
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })

        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (err) {
        console.error("Logout error:", err)
        res.status(500).json({ message: "Logout failed", error: err.message })
    }
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password -__v")

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        console.error("GetMe error:", err)
        res.status(500).json({ message: "Failed to fetch user details", error: err.message })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}
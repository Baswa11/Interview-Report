const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be in blacklist"]
    }
}, { timestamps: true })

const blackListModel = mongoose.model("blackList", blackListSchema)

module.exports = blackListModel
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        required : true,
        type: String,
        trim: true
    },

    email: {
        required: true,
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        required: true,
        type: String
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
},{timestamps: true})

module.exports = mongoose.model("User", userSchema)
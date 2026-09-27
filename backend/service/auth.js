const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email:user.email,
        role:user.role
    },secret);
}

function getUser(token){
    return jwt.verify(
        token, secret
    )
}

module.exports = {
    setUser, getUser
}
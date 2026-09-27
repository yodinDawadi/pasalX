const getUser = require("../service/auth")

export async function restrictToUserLoggedInUserOnly(req,res,next) {
    const userUid = req.cookies?.uid;
    if(!userUid){
        return res.status(404).json({message:"err"})
    }
    const user = getUser(userUid);
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    req.user = user;
    next();
}
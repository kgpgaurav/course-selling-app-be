const jwt=require('jsonwebtoken');
const {JWT_user_secret}= require('../config')

function userMiddleware(req, res, next){
    const token= req.headers.token;
    const decoded= jwt.verify(token, JWT_user_secret);

    if(decoded){
        req.userId=decoded.id;
        next()
    }else{
        res.status(403).json({
            message:" You are not signed in"
        })
    }
}

module.exports={
    userMiddleware:userMiddleware
}
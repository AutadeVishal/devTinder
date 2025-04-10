const jwt=require('jsonwebtoken');
const User=require("../models/user.js");
module.exports =  async (req, res, next) => {
        try{
            const {token}=req.cookies;
            if(!token){
                throw new Error("Token is Not Valid");
            }
            console.log("userauth found token",token);
            const decodedObj=await jwt.verify(token,"1234");
            console.log(decodedObj)
             const user=await User.findOne({_id:decodedObj._id});
             console.log("user from decoded OBj",user)
             if(!user){
                throw new Error("User not Found");
             }
             req.user=user;
             next();
        }
        catch(err){
            console.log(err.message);
            res.status(401).send(err.message);
        }
       
    };


const express=require('express');
const requestRouter=express.Router();
const userAuth=require('../middlewares/auth.js')
requestRouter.post('/sendConnectionRequest',userAuth,async (req,res)=>{
    const user=req.user;
    console.log("Sending COnnection Request");
    res.send("User",user);
})
module.exports=requestRouter;
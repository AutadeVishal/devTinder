const express=require('express');
const requestRouter=express.Router();
const User=require('../models/User.js')
const {ConnectionRequestModel}=require('../models/connectionRequest')
const userAuth=require('../middlewares/userAuth.js')
requestRouter.post('/request/send/:status/:toUserEmail',userAuth,async (req,res)=>{
   try{
    const fromUserId = req.user._id;
    const toUser=await User.findOne({email:req.params.toUserEmail});
    if(!toUser){
        throw new Error("User not Found");
    }
    const toUserId=toUser._id;
    const allowedStatus=["ignored","interested"];
    const status=req.params.status;
    if(!allowedStatus.includes(status)){
        throw new Error("Unidentified Status")
    }

    const existingConnectionRequest=await ConnectionRequestModel.findOne({
        $or :[
            {fromUserId:fromUserId,toUserId:toUserId},
            {fromUserId:toUserId,toUserId:fromUserId},
            //this is same as above commented 
            //here it check from the array of condition whether anyone of them is true 
            //if true then return the document
            //it is used to check mutiple conditions at a one like here from user and 
            // to user can be checked interchangibly becouse direction doesn't matter
           ]
    });
  
    if (existingConnectionRequest) {
            if (existingConnectionRequest.status === status) {
                return res.json({
                    message: `Connection request already exists with status "${status}" between ${req.user.firstName} and ${toUser.firstName}`,
                    data: existingConnectionRequest
                });
            }

            // Update the status of the existing connection request
            existingConnectionRequest.status = status;
            const info = await existingConnectionRequest.save();
            return res.json({
                message: `Status for ${req.user.firstName} updated as ${status} for User ${toUser.firstName}`,
                data: info
            });
        }
  
    const connectionrequest=new ConnectionRequestModel({
        fromUserId:fromUserId,
        toUserId:toUserId,
        status:status
    
    });

    //completely new one so add it in database
    const info=await connectionrequest.save();
    res.json({
        message: `${req.user.firstName} is Interested in ${toUser.firstName}`,
        data:{
            info
        }
    })
   }catch(err){
    console.log("Error in Sending Connection Request:",err.message);
    res.status(400).send("Error Occured");
   }
})
module.exports=requestRouter;
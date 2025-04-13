const express=require('express');
const profileRouter=express.Router();
const User=require('../models/user.js');
const {validateEditProfileData}=require('../utils/validation.js')
const {userAuth}=require('../middlewares/auth.js')
profileRouter.get('/view',userAuth, async (req, res) => {
  try {
    const user=req.user;
    res.send(user);
  } catch (err) {
    console.error("Error in /profile:", err.message);
    res.status(401).send("Invalid or expired token");
  }
});

profileRouter.patch('/edit',userAuth,async (req,res)=>{
try{
  const data=req.body;
  if(!data){
    throw new Error("No data to Update Given");
  }
if(!validateEditProfileData(data)){
  throw new Error("Not Allowed to Edit the Fields");
};
const loggedInUser=req.user;//this is provided by middlewre userAuth funciton
Object.keys(req.user).forEach(key=>loggedInUser[key]=req.user[key]);
const user = await User.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true });
res.json({
  message:`${loggedInUser.firstName},your Profile Got Updated `,
  data:loggedInUser,
});
}catch(err){
console.log("Error in Updating :",err.message);
res.status(401).send("You Can't Update")
}
})
module.exports=profileRouter;
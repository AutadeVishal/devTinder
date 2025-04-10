const express = require('express');
const app = express();
const connectDB=require('./config/database');
const User=require('./models/user');
const mongoose = require('mongoose');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');
const  validateSignUpData  = require('./utils/validation');
const validUpdate = require('./utils/validUpdate.js');
const jwt = require('jsonwebtoken');
const userAuth=require("./middlewares/auth.js");
app.use(express.json());
app.use(cookieParser());//converts the incoming request body to JSON format
connectDB()
.then(()=>app.listen(3000, () => {
    console.log("Server is running on port 3000");
}));

app.get('/profile',userAuth, async (req, res) => {
  try {
    const user=req.user;
    res.send(user);
  } catch (err) {
    console.error("Error in /profile:", err.message);
    res.status(401).send("Invalid or expired token");
  }
});


app.post('/login',async (req,res)=>{
try{
const {email,password}=req.body;
const user=await User.findOne({email:email});
if(!user){
  throw new Error("User Not Found");
}
const isPasswordValid=await user.validatePassword(password);
if(!isPasswordValid){
  throw new Error("Invalid Password");
}
  //const token=await jwt.sign({_id:user._id},"1234"); This can be ofloaded to user.js
  const token=await user.getJWT();
  console.log("Token generated:",token);
  res.cookie('token',token);
  res.send("Login Successful");
  console.log("User logged in:",user.email);
}
catch(err){
    console.error("Error in /login:",err.message);
    res.send(err.message);
}
});
app.patch('/user/:identifier', async (req, res) => {
  const data = req.body;
  const identifier = req.params?.identifier; // Can be email or user ID
  try {
   validUpdate(data);
    let user;
    const hashedPassword=await bcrypt.hash(data.password,10);
    data.password=hashedPassword;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      // If identifier is a valid ObjectId, treat it as user ID
      user = await User.findByIdAndUpdate(identifier, data, { new: true, runValidators: true });
    } else {
      // Otherwise, treat it as email
      user = await User.findOneAndUpdate({ email: identifier }, data, { new: true, runValidators: true });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Updated user:", user);
    res.send("User Updated Successfully");
  } catch (err) {
    console.log("Error in /user PATCH:", err.message);
    res.status(400).send(err.message);
  }
});

app.post('/signup',async (req,res)=>{ 

  try {
   
   await validateSignUpData(req.body); // Validate the input data
   const passwordHash=await bcrypt.hash(req.body.password,10);
   const { firstName, lastName, email, password, age, gender } = req.body;
    //here key Names are same as the model keys so we can directly pass the req.body to the model instead of key:value pairs
    const newUser = new User({
      firstName,
      lastName,
      email,
      password:passwordHash, 
      age,
      gender
    });
    
   const insertedDocument= await newUser.save();
    console.log(' User created:', insertedDocument);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error in /signup:', err.message);
    res.status(500).json({ error: err.message });
  }


  
  

});

//Get User by Email
app.get('/user',async (req,res)=>{
  const Email=req.body.email;

  try{
   const user= await User.findOne({email:Email});
  if(!user) res.status(404).json({error:"User not found"})
   else{
    res.send(user);
    console.log("User found:",user.email);
    console.log("User data sent successfully")
   }
  }
 catch(err){
    console.error("Error in /user:",err.message);
    res.status(500).json({error:"Internal server error"})
  }

})

//API to Access the Data of User for Feed in UI
app.get('/feed',async (req,res)=>{
  try{
    const users=await User.find({});
    res.send(users);
  }
  catch(err){
    console.error("Error in /feed:",err.message);
    res.status(500).json({error:"Internal server error"})
  };
});

//API for Delete User
app.delete('/delete',async (req,res)=>{
  const userID=req.body._id;
  try{
    const user=await User.findByIdAndDelete(userID);
    //shorthand for user.findOneAndDelete({_id:userID});
    if(!user)res.status(404).json({error:"User not found"});
    else{
      res.status(200).json({message:"User deleted successfully"});
      console.log("User deleted:",user.email);
    }
  }
  catch(err){
    console.error("Error in /delete:",err.message);
    res.status(500).json({error:"Internal server error"})
  }
});


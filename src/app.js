const express = require('express');
const app = express();
const connectDB=require('./config/database');
const User=require('./models/user');
const mongoose = require('mongoose');
app.use(express.json());//converts the incoming request body to JSON format
connectDB()
.then(()=>app.listen(3000, () => {
    console.log("Server is running on port 3000");
}));

app.patch('/user/:identifier', async (req, res) => {
  const data = req.body;
  const identifier = req.params?.identifier; // Can be email or user ID
  try {
    const allowedUpdates = ["firstName", "lastName", "age", "password", "skills"];
    const isUpdateAllowed = Object.keys(data).every(k => allowedUpdates.includes(k));
    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }
    if(data?.skills.length>3){
      throw new Error("Skills should be less than 3");
    }
    let user;

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
    res.status(400).send("Something Went Wrong");
  }
});

app.post('/signup',async (req,res)=>{ 
  try {
    const { firstName, lastName, email, password, age, gender } = req.body;

    // Basic input validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }


    // Create and save new user from its model
    //here key Names are same as the model keys so we can directly pass the req.body to the model instead of key:value pairs
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, 
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


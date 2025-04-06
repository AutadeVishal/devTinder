const express = require('express');
const app = express();
const connectDB=require('./config/database');
const User=require('./models/user');
app.use(express.json());//converts the incoming request body to JSON format
connectDB()
.then(()=>app.listen(3000, () => {
    console.log("Server is running on port 3000");
}));
app.post('/signup',async (req,res)=>{
  //accessing the request body for User Data
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


    // Create and save new user
    //here key Names are same as the model keys so we can directly pass the req.body to the model
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, 
      age,
      gender
    });

    await newUser.save();
    console.log(' User created:', newUser.email);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error in /signup:', err.message);
    res.status(500).json({ error: 'Internal server error' });
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


//API for Update User
app.patch('/user',async (req,res)=>{
  const data=req.body;
  try{
    const userId=data._id;
   const user= await User.findByIdAndUpdate({_id:userId},data,{returnDocument:"before"});
   //This Return Document is part of Options which returns the value to const variable "before" update or "after" update
console.log(user);
    res.send("User Updated Succesfully");
  }
  catch(err){
    console.log(err.message);
    res.status(400).send("Something Went Wrong");
  }
})
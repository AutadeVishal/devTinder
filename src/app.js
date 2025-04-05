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
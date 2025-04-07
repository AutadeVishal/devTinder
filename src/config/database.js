const mongoose=require('mongoose');
const connectDB=async ()=>{
    try{
         await mongoose.connect("mongodb+srv://autadevishalvijay:Vishal1144@cluster0.xukjcup.mongodb.net/devTinder")
            console.log("MongoDB connected successfully")
       
        
    }
 catch(err){
        console.error("MongoDB connection error:", err.message);
       process.exit(1); // Exit the process with failure
 }
};
module.exports=connectDB;
const mongoose=require('mongoose');
const connectDB=async ()=>{
    try{
        await mongoose.connect("Secreet").then(()=>{
            console.log("MongoDB connected successfully")
        })
        
    }
 catch(err){
        console.error("MongoDB connection error:", err.message);
       process.exit(1); // Exit the process with failure
 }
};
module.exports=connectDB;
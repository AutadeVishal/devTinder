const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    firstName:{type:String,required:true,maxlength:50,minLength:2},
    lastName:{type:String,required:true,maxlength:50,minLength:2},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true},
    password:{type:String,required:true,minLength:8},
    age:{type:Number,required:true,min:18,},
    gender:{type:String,required:true,validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error("Gender Data Not Valid");
        }
    }},
    about:{type:String,default:"Description Not Available",maxlength:300}
});


module.exports=mongoose.model("User",userSchema);; 
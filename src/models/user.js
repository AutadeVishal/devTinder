const mongoose=require('mongoose');
const isvalidemail=require('validator').isEmail;
const isvalidpassword=require('validator').isStrongPassword;
const userSchema=new mongoose.Schema({
    firstName:{type:String,required:true,maxlength:50,minLength:2},
    lastName:{type:String,required:true,maxlength:50,minLength:2},
    email:{type:String,required:true,unique:true,lowercase:true,trim:true,validate(value){
        if(!isvalidemail){
            throw new Error("Type Correct Email");
        }
    }},
    password:{type:String,required:true,minLength:8,validate(value){
        if(!isvalidpassword(value)){
            throw new Error('Password Not Strong Enough');
        }
    }},
    age:{type:Number,required:true,min:18,},
    gender:{type:String,required:true,validate(value){
        if(!["male","female","others"].includes(value)){
            throw new Error("Gender Data Not Valid");
        }
    }},
    about:{type:String,default:"Description Not Available",maxlength:300},
   skills:{type:[String]}
},
{
    timestamps:true
}

);


module.exports=mongoose.model("User",userSchema);; 
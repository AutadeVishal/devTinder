const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        index:true,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        //this index is used only when object.find(toUserId) is called then only
        //  this is efficient else for multiple ones also keep compound index as well
        index:true,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is Not Allowed`
        },
        required: true
    }
}, {
    timestamps: true // Enable automatic createdAt and updatedAt fields
});
//this method is called every time you called ConnectionRequestObject.save()
connectionRequestSchema.pre("save",async function (req,res,next){
    const connectionRequest=this;
    //to check User Sending Connection Request to himself
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Sending request to Himself");
    }
    //next();//as this is like a middleware called before .save() method but next() is only called if it was a non-async funciton
});
//connectionRequest.find({fromUserId:somethinng,toUserId:something})
//this is ahving multiple fields to be searched upon
//so we will use compound index
connectionRequestSchema.index({fromUserId:1,toUserId:1});
//here 1 is ascending order and -1 is descending order
const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = { ConnectionRequestModel };
const express = require('express');
const userRouter = express.Router();
const connectionRequestModel = require('../models/connectionRequest.js');
const userAuth = require('../middlewares/userAuth.js');




userRouter.get('/view', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

       
        const connectionRequests = await connectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName"]);

        
        if (connectionRequests.length === 0) {
            return res.json({
                message: `No one is Interested in You Bro Sad`,
                body: `As Empty as your GF List`
            });
        }
        const data=connectionRequests.map(row=>row.fromUserId);
        
        res.json({
            message: `Interested Pending Candidates are`,
            body: data
        });
    } catch (err) {
        console.error("Error fetching connection requests:", err.message);
        res.status(500).send("An error occurred while fetching connection requests");
    }
});

// Get all the connections for the logged-in user
userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

       
        const connectedUsers = await connectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
        .populate("fromUserId", ["firstName", "lastName"])//first argument is the field of current collection having _id of other document of other colletion and second argument is array of fields to put in the data of current field
        .populate("toUserId", ["firstName", "lastName"]);

       
        const connections = connectedUsers.map((connection) => {
            if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
                
                return connection.toUserId;
            } else {
                
                return connection.fromUserId;
            }
        });

        res.json({
            message: `Your Connections`,
            body: connections
        });
    } catch (err) {
        console.error("Error fetching connections:", err.message);
        res.status(500).send("Not Able to Get Connections");
    }
});

module.exports = userRouter;
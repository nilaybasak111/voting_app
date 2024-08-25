const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const z = require("zod");

// Importing the Middlewares
const {jwtmiddleware, generatetoken} = require("../jwt")

// Importing the Models
const User = require("../models/usermodel");
const { json } = require("body-parser");

// Creating SignUp EndPoint. POST route to add a User or Voter
router.post("/signup", async (req, res) => {
    try {
        // We are sending User or Voter Data into the Body
        const data = req.body;
        
        // Here We are checking, Is User or Voter already an Adminuser or not
        const Adminuser = await User.findOne({ role : 'admin' });
        if(data.role === 'admin'&& Adminuser) {
            return res.status(400).json({ error : 'Admin User is Already Exists'});
        }

        // Validate Aadhar Card Number must have exactly 12 digit
        const aadharvalidation = z.string().length(12).regex(/^\d+$/).transform((val) => parseInt(val));
        const aadharvalidationResult = aadharvalidation.safeParse(data.aadharCardNumber);
        if(!aadharvalidationResult.success){
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }


        // Check that the Aadhar Card Number already exists in the Database or Not
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if(existingUser){
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the New User to the Database
        const saveUser = await newUser.save();
        console.log("New User Created Successfully")

        const tokenPayload = {
            id: saveUser.id
        }
        console.log(JSON.stringify(tokenPayload));

        // Generating the Token
        const token = generatetoken(tokenPayload);

        res.status(200).json({response: tokenPayload, token: token});
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Creating LogIn EndPoint. POST route to Login an Exsiting User or Voter
router.post("/login", async(req, res) =>{
    try{
        // Extracting the Aadhar Card Number and Password form the Body
        const { aadharCardNumber, password } = req.body;

        // Check if aadharCardNumber or password is missing
        if(!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        // Find the User or Voter by aadharCardNumber
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if(!user || user.password !== password){
            return res.status(401).json({error: 'Invalid Aadhar Card Number or Password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
        }
        const token = generatetoken(payload);

        // resturn token as response
        res.json({token: token })

    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Creating Profile Route
router.get("/profile", jwtmiddleware, async(req, res) =>{
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});

    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Here We Change the User or Voter password
router.put("/profile/password", jwtmiddleware, async(req, res) =>{
    try{
        // Here we Etaking Id from req.user from jwtmiddleware
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Here We are checking or currentPassword and newPassword present in the request body
        if( !currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both currentPassword and newPassword are required' "});
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If User or Voter does not exist or password does not match, return error
        if( !user || !user.password == currentPassword ){
            return res.status(401).json({ error: "Invalid current password"});
        }

        // Update the User or Voter Password
        user.password = newPassword;
        await user.save();

        console.log("Password Updated Successfully")
        res.status(200).json({ message: 'Password Updated Successfully' });

    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;  
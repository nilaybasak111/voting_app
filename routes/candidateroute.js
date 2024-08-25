const express = require("express");
const router = express.Router();

// Importing the Middlewares
const {jwtmiddleware, generatetoken} = require("../jwt")

// Importing the Models
const User = require("../models/usermodel");
const Candidate = require("../models/candidatemodel");

// This Function Checks is the User or Voter Admin Or Not. And if it's Admin then it can allow the User or Voter.
const checkAdminRole = async (userId) =>{
    try{
        const user = await User.findById(userId);
        if(user.role === 'admin'){
            return true;
        }
    }catch(err){
        return false;
    }
}


// Creating a New Candidate
router.post("/candidates", jwtmiddleware, async(req,res)=>{
    try{
        if(!(checkAdminRole(req.user.id))){
            return res.status(403).json({message: 'user does not have admin role'});
        }

        // We are Assuming the request body contains the candidate data
        const data = req.body;

        // Create a new User document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the New Candidate Data to the Database
        const response = await newCandidate.save();
        console.log("Candidate Data Save Successfully");
        res.status(200).json({response: response});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


// Update a existing candidate
router.put("/candidates/:candidateId", jwtmiddleware, async(req,res)=>{
    try{
        if(!(checkAdminRole(req.user.id))){
            return res.status(403).json({message: 'user does not have admin role'});
        }

        // Extract the id from the URL parameter
        const candidateId = req.params.candidateId;
        
        // Updated data for the person
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Mongoose Run a validation Check according to the Schema
        });

        if(!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


// Delete a Existing Candidate from the Candidate list
router.delete("/candidates/:candidateId", jwtmiddleware, async(req, res)=> {
    try{
        if(!(checkAdminRole(req.user.id))){
            return res.status(403).json({message: 'user does not have admin role'});
        }

        // Extract the id from the URL parameter
        const candidateId = req.params.candidateId;

        // Deleting the Candidate using candidateId
        const deleteCandidate = await User.findByIdAndDelete(candidateId);

        if(!deleteCandidate){
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json(response);


    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})


module.exports = router;
const express = require("express");
const router = express.Router();

// Importing the Middlewares
const {jwtmiddleware, generatetoken} = require("../jwt")

// Importing the Models
const User = require("../models/usermodel");
const Candidate = require("../models/candidatemodel");


// Get List of All Candidates with only name and party fields
router.get("/candidates", async(req, res)=>{
    try{
        // Find all candidates and select only the name and party fields, excluding _id
        const allCandidate = await Candidate.find({}, 'name party -_id');

        // Return the List of the Candidate
        res.status(200).json(allCandidate);

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



// Here User or Voter can give their Votes
router.get("/:candidateId", jwtmiddleware, async(req, res)=>{
    // no admin can vote
    // user can only vote once

    const candidateId = req.params.candidateId;
    const userId = req.user.id;

    try{
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateId);
        
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }


        // Checking User is an Admin or Not
        const isAdmin = await User.findById(userId);

        if(isAdmin.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed to Vote'});
        }

        // Checking User or Voter given their Vote or Not
        if(isAdmin.isVoted = true){
            return res.status(400).json({ message: 'You have already given Your Vote' });
        }


        // Update the Candidate document to record the vote
        candidate.votes.push({ isAdmin: userId});
        candidate.voteCount++;
        await candidate.save();


        // Update the User or Voter document
        isAdmin.isVoted = true;
        await isAdmin.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });


    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// Get the list of candidates sorted by their vote counts
router.get("/counts", async(req, res)=>{
    try{
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return{
                Party : data.party,
                Count : data.voteCount,
            }
        });

        return res.status(200).json(voteRecord);


    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error001' });}
})



module.exports = router;
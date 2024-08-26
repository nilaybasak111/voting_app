const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const bodyparser = require("body-parser");
app.use(bodyparser.json()); 

const PORT = process.env.PORT;

// Initiateing Database Connection
const connectdb = require("./Database/dbconnect")
connectdb();

// Importing the Routes
const userroute = require ("./routes/userroute")
const candidateroute = require("./routes/candidateroute")
const votingroute = require("./routes/votingroute")

// Using the Routes
app.use("/user",userroute);
app.use("/candidates",candidateroute);
app.use("/vote",votingroute);

app.listen(PORT, ()=>{
    console.log(`Server is on Port ${PORT}`);
});
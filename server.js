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




/*

{ 
    "name" : "nilay basak",
    
    "age" : "20",

    "email" : "nilaybasak000@gmail.com",

    "number" : "9800867053",

    "address" : "bdo office",

    "aadharCardNumber" : "123456789200",

    "password" : "123456789"
}

token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzllYTVlY2YwZDdkYzcxMmZkMDU4OCIsImlhdCI6MTcyNDc0NTQ1MX0.BjsnG6EIYCyo9VOIQqenjGkM9N8_V_4sN6gymvYpVBo

sam token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Yzk1ZTE5NmI4YWIxYzZmOGI3NGNiNCIsImlhdCI6MTcyNDc0NjkxM30.vKH3s226fOpsJXRXsTpsLw1po13fu8HtWDDOYQtwoTM

ramu kaka token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Yzk5YjcwYzhjNzQzZTNiODZjMWE3ZSIsImlhdCI6MTcyNDc2NzEwMH0.UH1bL9sdfdzWRvljWn4c5o_UgzKUJ4KyHtlW6I5_E1o

{ 
    "name" : "admin sir",
    
    "age" : "20",

    "email" : "admin@gmail.com",

    "number" : "9800867000",

    "address" : "bdo office",

    "aadharCardNumber" : "123456789444",

    "password" : "hhyyyhbb"
}

token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2Y2MyOGE4ODc2OGU0Mjg1MjZkMGE5ZiIsImlhdCI6MTcyNDc0NjA2Nn0.XUjwV_skUfmDKqtVowramp2iAK9F1KEErhf1RHNhE_M

*/
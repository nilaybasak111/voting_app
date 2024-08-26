const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const generatetoken = (UserData) => {
    // Generate a new JWT token using user data
    //return jwt.sign(UserData, process.env.JWT_SECRET, {expiresIn: 300000});
    return jwt.sign(UserData, process.env.JWT_SECRET);
}

const jwtmiddleware = (req, res, next) => {
    // First we check request headers has authorization or not
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({error : "Token is not Found"});
    }

    // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    if(!token) {
        return res.status(401).json({error : "Unauthorized"});
    }

    try {
        // Here we verify the token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decode)

        // Attach user information to the request object
        req.user = decode; // in req.user we get the id
        next();
    } catch(err) {
        console.log(err);
        res.status(401).json({err : 'Invalid Token'});
    }
}

module.exports = {jwtmiddleware, generatetoken};
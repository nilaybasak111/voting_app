const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    age : {
        type : Number,
        required : true
    },

    email : {
        type : String,
    },

    number : {
        type : String,
    },

    address : {
        type : String,
        required : true
    },

    aadharCardNumber : {
        type : Number,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true,
    },

    role : {
        type : String,
        required : true,
        enum : ['voter', 'admin'],
        default : 'voter'

    },

    isVoted : {
        type : Boolean,
        required : true,
        default : false
    }

});

const User = mongoose.model('User', userschema);
module.exports = User;
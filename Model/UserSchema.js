const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    password: {
        type: Number,
        required : true
    },
    gender: {
        type : String,
        enum : ['male','female','others']
    },
    isVerfied : {
        type : Boolean,
        default : false
    }

});

const User = mongoose.model('User', userSchema);
module.exports = User
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type : String,
            required: true,
            minlength: [3, 'Firstname must be at least 3 characters long'],
        },
        lastname: {
            type : String,
            minlength: [3, 'Lastname must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [6, 'Email must be at least 3 characters long'],
        matches: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email address!']
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        default: 'user'
    },
});


userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function(next) {   
    if(!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});


module.exports = mongoose.model('User', userSchema);
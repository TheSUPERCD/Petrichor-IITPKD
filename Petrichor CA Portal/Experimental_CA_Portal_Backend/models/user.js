var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    college: String,
    isVerified: Boolean,
    password: String,
    points: Number,
    registrations: Number,
    registrationsOn: Number,
    rank: String,
    token_id: String,
    changePassToken: String,
    profileImage: String,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
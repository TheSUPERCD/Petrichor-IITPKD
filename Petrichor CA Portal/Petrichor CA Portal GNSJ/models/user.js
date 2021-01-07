var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    points: Number,
    token_id: String,
    name: String,
    email: String,
    username: String,
    password: String,
    college: String,
    registrationsOn: Number,
    registrations: Number,
    rank: String,
    profileImage: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
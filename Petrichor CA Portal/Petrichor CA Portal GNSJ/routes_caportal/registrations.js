var express = require("express");
var User = require("../models/user");
var router = express.Router();
var mongoose = require("mongoose");
var flush = require("connect-flash");
var session = require('express-session');
var passport = require("passport");

router.use(
    require("express-session")({
        secret: "Petrichor is the techno-Cultural Fest of IIT Palakkad",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    })
);


router.get("/", isLoggedIn, function(req, res) {
    var details;
    mongoose.connect(
        "mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        function(err, db) {
            if (err) {
                res.redirect("/ca-portal/login");
            } else {
                db.collection("users")
                    .find({ username: req.user.username })
                    .toArray(function(err, docs) {
                        details = docs;
                        res.render("Registrations.ejs", { user_info: details });
                    });
            }
        }
    );
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/ca-portal/login");
    }
}

module.exports = router;
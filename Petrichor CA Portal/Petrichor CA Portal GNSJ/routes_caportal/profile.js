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
    User.find({ username: "a" }, { profileImage: 1 }, function(err, result) {
        var image = result[0].profileImage;
        var Image = "http://" + req.headers.host + "/" + image;
        console.log(req.headers.host)
        res.render("profile.ejs", { profile: Image })
    })
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/ca-portal/login");
    }
}

module.exports = router;
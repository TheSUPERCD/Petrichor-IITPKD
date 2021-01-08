var express = require("express");
var User = require("../models/user");
var router = express.Router();
var mongoose = require("mongoose");
var flush = require("connect-flash");
var session = require('express-session');
var passport = require("passport");

var multer = require("multer");
router.use(
    require("express-session")({
        secret: "Petrichor is the techno-Cultural Fest of IIT Palakkad",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    })
);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
})

var upload = multer({ storage: storage });
router.post('/uploadfile', isLoggedIn, upload.single('dp'), (req, res, next) => {
    var username = req.user.username;
    User.findOneAndUpdate({ username: username }, { $set: { profileImage: req.file.path } }, function(err, result) {
        res.redirect("/ca-portal/profile");
    });
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/ca-portal/login");
    }
}

router.get("/", isLoggedIn, function(req, res) {
    var username = req.user.username;
    var profileImage = req.user.profileImage;
    User.find({ username: username }, { profileImage: profileImage }, function(err, result) {
        var image = result[0].profileImage;
        var Image = "http://" + req.headers.host + "/" + image;
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
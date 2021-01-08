var express = require("express");
var User = require("../models/user");
var router = express.Router();
var mongoose = require("mongoose");
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


router.get("/", function(req, res) {
    req.logout();
    res.redirect("/ca-portal/login");
});

module.exports = router;
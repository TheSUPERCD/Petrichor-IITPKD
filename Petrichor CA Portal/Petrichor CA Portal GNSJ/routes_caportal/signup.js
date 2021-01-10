var express = require("express");
var User = require("../models/user");
var router = express.Router();
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

var initial_reg = 0;
var initial_regOn = 0;
initial_rank = "NIL";
initial_points = 0;

router.use(flush());
router.use('/signup', express.static("public"));
router.use('/login', express.static("public"));


router.get("/signup", function(req, res) {
    res.render("signup.ejs", { string: req.flash("alert") });
});



router.post("/signup", function(req, res) {
    if (req.body.password == req.body.repass) {
        User.register(
            new User({
                username: req.body.username,
                points: initial_points,
                name: req.body.name,
                college: req.body.college,
                email: req.body.email,
                totRegis: initial_reg + initial_regOn,
                registrations: initial_reg,
                registrationsOn: initial_regOn,
                rank: initial_rank,
                token_id: get_token(8),
                profileImage: "//placehold.it/100"
            }),
            req.body.password,
            function(err, user) {
                if (err) {
                    console.log(err)
                    if (err.name == "UserExistsError") {
                        req.flash('alert', '*User Already Exists');
                        return res.redirect("/ca-portal/signup");
                    }
                }
                passport.authenticate("local")(req, res, function() {
                    res.redirect("/ca-portal/dashboard");
                });
            }
        );
    } else {
        req.flash('alert', 'Invalid Credentials');
        res.redirect('/ca-portal/signup')
    }
});

router.get("/login", function(req, res) {
    var error = req.session.messages;
    req.session.messages = []
    res.render("login.ejs", { error: error || [] });
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/ca-portal/dashboard",
        failureRedirect: "/ca-portal/login",
        failureMessage: '*Invalid Username or Password'
    })
);

function get_token(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router;
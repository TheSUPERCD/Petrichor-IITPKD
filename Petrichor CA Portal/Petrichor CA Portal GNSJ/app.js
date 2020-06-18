var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var LocalStrategy = require("passport-local");

var app = express();
var name = ["gokul", "abhi", "amma"];

mongoose.connect("mongodb://localhost:27017/database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// mongoose.connect('mongodb://localhost/database', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(
    require("express-session")({
        secret: "Petrichor is the techno-Cultural Fest of IIT Palakkad",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/signup", function(req, res) {
    var valid = [""];
    var flag = 1;
    res.render("signup.ejs", { string: valid });
});

app.post("/signup", function(req, res) {
    if (req.body.password == req.body.repass) {
        User.register(
            new User({
                username: req.body.username,
                name: req.body.name,
                college: req.body.college,
                email: req.body.email,
            }),
            req.body.password,
            function(err, user) {
                if (err) {
                    var valid = [""];
                    if (err.name == "UserExistsError")
                        valid = ["*Username Already Exists"];
                    return res.render("signup.ejs", { string: valid });
                }
                passport.authenticate("local")(req, res, function() {
                    res.redirect("/dashboard");
                });
            }
        );
    } else {
        var invalid = ["*Invalid Credential"];
        res.render("signup.ejs", { string: invalid });
    }
});

app.get("/login", function(req, res) {
    res.render("login.ejs");
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    }),
    function(req, res) {}
);

app.get("/dashboard", isLoggedIn, function(req, res) {
    res.render("Dashboard.ejs");
});

app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile.ejs");
});

app.get("/registrations", isLoggedIn, function(req, res) {
    res.render("Registrations.ejs");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

app.get("/ca-information", function(req, res) {
    var detail_info = [];
    mongoose.connect(
        "mongodb://localhost:27017/database", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        function(err, db) {
            var details = db.collection("users").find();
            details.forEach(
                function(data, err) {
                    detail_info.push(data);
                },
                function() {
                    console.log(detail_info);
                    res.render("ca-details.ejs", { details: detail_info });
                }
            );
        }
    );
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

app.get("/*", function(req, res) {
    res.send("404 Page not found");
});

app.listen(3001, function() {
    console.log("SERVER IS LISTENING");
});
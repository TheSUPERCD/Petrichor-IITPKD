var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("./models/user");
var passportLocalMongoose = require("passport-local-mongoose");
var LocalStrategy = require("passport-local");
var flush = require("connect-flash");


var app = express();

app.use("/ca-portal/login", express.static("public"));
app.use("/ca-portal/dashboard", express.static("public"));
app.use("/ca-portal/registrations", express.static("public"));
app.use("/ca-portal/profile", express.static("public"));
app.use("/ca-portal/ca-information", express.static("public"));
app.use("/ca-portal/signup", express.static("public"));
app.use("/ca-portal/admin/registrations", express.static("public"));

// mongoose.connect("mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
var initial_reg = 0;
initial_rank = "NIL";
initial_points = "NIL";
// mongoose.connect('mongodb://localhost/database', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(
    "mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

app.use(
    require("express-session")({
        secret: "Petrichor is the techno-Cultural Fest of IIT Palakkad",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    })
);

mongoose.set('useFindAndModify', false);
app.use(flush())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/ca-portal/signup", function(req, res) {
    var valid = [""];
    var flag = 1;
    res.render("signup.ejs", { string: req.flash("alert") });
});



app.post("/ca-portal/signup", function(req, res) {
    if (req.body.password == req.body.repass) {
        User.register(
            new User({
                username: req.body.username,
                points: initial_points,
                name: req.body.name,
                college: req.body.college,
                email: req.body.email,
                registrations: initial_reg,
                rank: initial_rank,
                token_id: get_token(8),
            }),
            req.body.password,
            function(err, user) {
                if (err) {
                    if (err.name == "UserExistsError"); {
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

app.get("/ca-portal/login", function(req, res) {
    res.render("login.ejs");
});

app.post(
    "/ca-portal/login",
    passport.authenticate("local", {
        successRedirect: "/ca-portal/dashboard",
        failureRedirect: "/ca-portal/login",
    })
);

app.get("/ca-portal/dashboard", isLoggedIn, function(req, res) {
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
                        res.render("Dashboard.ejs", { user_info: details });
                    });
            }
        }
    );
});

app.get("/ca-portal/profile", isLoggedIn, function(req, res) {
    res.render("profile.ejs");
});

app.get("/ca-portal/registrations", isLoggedIn, function(req, res) {
    res.render("Registrations.ejs");
});

app.get("/ca-portal/logout", function(req, res) {
    req.logout();
    res.redirect("/ca-portal/login");
});

app.get("/ca-portal/ca-information", function(req, res) {
    var detail_info = [];
    mongoose.connect(
        "mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
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
                    res.render("ca-details.ejs", { details: detail_info });
                }
            );
        }
    );
});


app.get("/ca-portal/admin/registrations", function(req, res) {
    res.render("rank_update.ejs", { message: req.flash('message') });
});

app.post("/ca-portal/admin/registrations", function(req, res) {
            var token = req.body.token;
            var num_reg = parseInt(req.body.registrations);
            var points = parseInt(req.body.points);
            User.findOneAndUpdate({ token_id: token }, { $inc: { registrations: num_reg, points: points } }, function(error, result) {
                if (error) {
                    req.flash('message', 'Submission Failed');
                    res.redirect("/ca-portal/admin/registrations");
                } else if(!result) {
                    req.flash('message', 'Incorrect Details, No user Exists');
                    res.redirect("/ca-portal/admin/registrations");                    
                }
                else{
                    req.flash('message', 'Saved successfully')
                    res.redirect("/ca-portal/admin/registrations")
                }
            });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/ca-portal/login");
    }
}

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

app.get("/*", function(req, res) {
    res.send("404 Page not found");
});

// app.listen(3001, function() {
//     console.log("SERVER IS LISTENING");
// });
const port = process.env.PORT || 3001;

// app.listen(process.env.PORT, process.env.IP);
app.listen(port, () => console.log("Server Started......."));
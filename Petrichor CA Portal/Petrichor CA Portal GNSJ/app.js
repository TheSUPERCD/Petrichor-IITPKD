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

// routes
var signup = require("./routes_caportal/signup");
var admin = require("./routes_caportal/admin");
var dashboard = require("./routes_caportal/dashboard");
var ca_info = require("./routes_caportal/ca_info");
var profile = require("./routes_caportal/profile");

var multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })
var initial_reg = 0;
initial_rank = "NIL";
initial_points = 0;
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
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/ca-portal/dashboard", dashboard, express.static("public"));
app.use("/ca-portal/registrations", express.static("public"));
app.use("/ca-portal/profile", profile, express.static("public"));
app.use("/ca-portal/ca-information", ca_info, express.static("public"));
app.use("/ca-portal/", signup, express.static("public"));
app.use("/ca-portal/admin", admin, express.static("public"));




// app.get("/ca-portal/signup", function(req, res) {
//     res.render("signup.ejs", { string: req.flash("alert") });
// });



// app.post("/ca-portal/signup", function(req, res) {
//     if (req.body.password == req.body.repass) {
//         User.register(
//             new User({
//                 username: req.body.username,
//                 points: initial_points,
//                 name: req.body.name,
//                 college: req.body.college,
//                 email: req.body.email,
//                 registrations: initial_reg,
//                 rank: initial_rank,
//                 token_id: get_token(8),
//                 profileImage: "//placehold.it/100"
//             }),
//             req.body.password,
//             function(err, user) {
//                 if (err) {
//                     console.log(err)
//                     if (err.name == "UserExistsError") {
//                         req.flash('alert', '*User Already Exists');
//                         return res.redirect("/ca-portal/signup");
//                     }
//                 }
//                 passport.authenticate("local")(req, res, function() {
//                     res.redirect("/ca-portal/dashboard");
//                 });
//             }
//         );
//     } else {
//         req.flash('alert', 'Invalid Credentials');
//         res.redirect('/ca-portal/signup')
//     }
// });

// app.get("/ca-portal/login", function(req, res) {
//     var error = req.session.messages;
//     req.session.messages = []
//     res.render("login.ejs", { error: error || [] });
// });

// app.post(
//     "/ca-portal/login",
//     passport.authenticate("local", {
//         successRedirect: "/ca-portal/dashboard",
//         failureRedirect: "/ca-portal/login",
//         failureMessage: '*Invalid Username or Password'
//     })
// );

// app.get("/ca-portal/dashboard", isLoggedIn, function(req, res) {
//     var details;
//     mongoose.connect(
//         "mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         },
//         function(err, db) {
//             if (err) {
//                 res.redirect("/ca-portal/login");
//             } else {
//                 db.collection("users")
//                     .find({ username: req.user.username })
//                     .toArray(function(err, docs) {
//                         details = docs;
//                         console.log(details);
//                         res.render("Dashboard.ejs", { user_info: details });
//                     });
//             }
//         }
//     );
// });

// app.get("/ca-portal/profile", isLoggedIn, function(req, res) {
//     User.find({ username: "a" }, { profileImage: 1 }, function(err, result) {
//         var image = result[0].profileImage;
//         var Image = "http://" + req.headers.host + "/" + image;
//         console.log(req.headers.host)
//         res.render("profile.ejs", { profile: Image })
//     })
// });
app.get("/ca-portal/registrations", isLoggedIn, function(req, res) {
    res.render("Registrations.ejs");
});

app.get("/ca-portal/logout", function(req, res) {
    req.logout();
    res.redirect("/ca-portal/login");
});

// app.get("/ca-portal/ca-information", function(req, res) {
//     var detail_info = [];
//     mongoose.connect(
//         "mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         },
//         function(err, db) {
//             var details = db.collection("users").find();
//             details.forEach(
//                 function(data, err) {
//                     detail_info.push(data);
//                 },
//                 function() {
//                     rank_updation();
//                     res.render("ca-details.ejs", { details: detail_info });
//                 }
//             );
//         }
//     );
// });


// app.get("/ca-portal/admin/registrations", function(req, res) {
//     res.render("rank_update.ejs", { message: req.flash('message') });
// });

// app.post("/ca-portal/admin/registrations", function(req, res) {
//     var token = req.body.token;
//     var num_reg = parseInt(req.body.registrations);
//     var points = parseInt(req.body.points);
//     User.findOneAndUpdate({ token_id: token }, { $inc: { registrations: num_reg, points: points } }, function(error, result) {
//         if (error) {
//             req.flash('message', 'Submission Failed');
//             res.redirect("/ca-portal/admin/registrations");
//         } else if (!result) {
//             req.flash('message', 'Incorrect Details, No user Exists');
//             res.redirect("/ca-portal/admin/registrations");
//         } else {
//             rank_updation()
//             rank_updation()
//             req.flash('message', 'Saved successfully')
//             res.redirect("/ca-portal/admin/registrations")
//         }
//     });
// });

app.post('/uploadfile', isLoggedIn, upload.single('myFile'), (req, res, next) => {
    User.findOneAndUpdate({ token_id: "o2Qv7ATT" }, { $set: { profileImage: req.file.path } }, function(err, result) {
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

// function get_token(length) {
//     var result = "";
//     var characters =
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     var charactersLength = characters.length;
//     for (var i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     }
//     return result;
// }



app.get("/*", function(req, res) {
    res.send("404 Page not found");
});

// app.listen(3001, function() {
//     console.log("SERVER IS LISTENING");
// });
const port = process.env.PORT || 3001;

// app.listen(process.env.PORT, process.env.IP);
app.listen(port, () => console.log("Server Started......."));
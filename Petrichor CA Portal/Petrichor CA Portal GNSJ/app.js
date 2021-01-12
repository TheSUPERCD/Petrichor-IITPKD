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
var multer = require("multer");


// routes
var signup = require("./routes_caportal/signup");
var admin = require("./routes_caportal/admin");
var dashboard = require("./routes_caportal/dashboard");
var ca_info = require("./routes_caportal/ca_info");
var profile = require("./routes_caportal/profile");
var registrations = require("./routes_caportal/registrations");
var logout = require("./routes_caportal/logout");



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
app.use("/ca-portal/registrations", registrations, express.static("public"));
app.use("/ca-portal/profile", profile, express.static("public"));
app.use("/ca-portal/ca-information", ca_info, express.static("public"));
app.use("/ca-portal/", signup, express.static("public"));
app.use("/ca-portal/admin", admin, express.static("public"));
app.use("/ca-portal/logout", logout, express.static("public"));




app.get("/*", function(req, res) {
    res.send("404 Page not found");
});
const port = process.env.PORT || 9000;


app.listen(port, () => console.log("Server Started......."));
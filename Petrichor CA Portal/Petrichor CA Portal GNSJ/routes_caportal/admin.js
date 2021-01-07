var express = require("express");
var User = require("../models/user");
var router = express.Router();
var mongoose = require("mongoose");
var flush = require("connect-flash");

router.use(
    require("express-session")({
        secret: "Petrichor is the techno-Cultural Fest of IIT Palakkad",
        cookie: { maxAge: 60000 },
        resave: false,
        saveUninitialized: false,
    })
);



router.use(flush());

router.get("/registrations", function(req, res) {
    res.render("rank_update.ejs", { message: req.flash('message') });
});

router.post("/registrations", function(req, res) {
    var token = req.body.token;
    var num_reg = parseInt(req.body.registrations);
    var num_regOn = parseInt(req.body.registrationsOn);
    var points = parseInt(req.body.points);
    User.findOneAndUpdate({ token_id: token }, { $inc: { registrations: num_reg, points: points, registrationsOn: num_regOn } }, function(error, result) {
        if (error) {
            req.flash('message', 'Submission Failed');
            res.redirect("/ca-portal/admin/registrations");
        } else if (!result) {
            req.flash('message', 'Incorrect Details, No user Exists');
            res.redirect("/ca-portal/admin/registrations");
        } else {
            rank_updation()
            rank_updation()
            req.flash('message', 'Saved successfully')
            res.redirect("/ca-portal/admin/registrations")
        }
    });
});

function rank_updation() {
    var user = []
    mongoose.connect(
        "mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        function(err, db) {
            var data = db.collection("users").find().sort({ points: -1, registrations: -1 });
            data.forEach((da, err) => {
                user.push({ username: da.username, points: da.points, rank: 0, registrations: da.registrations, online: da.registrationsOn })
                    // console.log(da)
            }, function() {
                for (i = 0; i < user.length; i++) {
                    p = parseInt(user[i].points);
                    if (p != 0) {
                        if (i > 0) {
                            if (p == parseInt(user[i - 1].points) && (user[i].registrations + user[i].online) == user[i - 1].registrations + user[i - 1].online) {
                                user[i].rank = user[i - 1].rank;
                                User.findOneAndUpdate({ username: user[i].username }, { $set: { rank: user[i - 1].rank } }, (err, results) => {
                                    console.log(results);
                                })
                            } else {
                                user[i].rank = user[i - 1].rank + 1;
                                User.findOneAndUpdate({ username: user[i].username }, { $set: { rank: (user[i].rank).toString() } }, (err, results) => {
                                    console.log(results);
                                })
                            }
                        } else if (i == 0) {
                            user[i].rank = 1
                            User.findOneAndUpdate({ username: user[i].username }, { $set: { rank: 1 } }, (err, results) => {
                                console.log(results);
                            })
                        }
                    }
                }
            });
        }
    );
}
module.exports = router;
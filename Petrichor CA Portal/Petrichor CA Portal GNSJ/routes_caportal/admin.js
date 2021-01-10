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

router.use('/registrations', express.static("public"));

router.use(flush());

router.get("/registrations", function(req, res) {
    res.render("rank_update.ejs", { message: req.flash('message') });
});

router.post("/registrations", function(req, res) {
    var token = req.body.token;
    var num_reg = parseInt(req.body.registrations);
    var num_regOn = parseInt(req.body.registrationsOn);
    var points = parseInt(req.body.points);
    User.findOneAndUpdate({ token_id: token }, { $inc: { registrations: num_reg, points: points, registrationsOn: num_regOn, totRegis: num_regOn + num_reg } }, function(error, result) {
        if (error) {
            req.flash('message', 'Submission Failed');
            res.redirect("/ca-portal/admin/registrations");
        } else if (!result) {
            req.flash('message', 'Incorrect Details, No user Exists');
            res.redirect("/ca-portal/admin/registrations");
        } else {
            rank_updation();
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
            var data = db.collection("users").find().sort({ points: -1, totRegis: -1, registrations: -1, registrationsOn: -1 });
            data.forEach((da, err) => {
                user.push({ username: da.username, points: da.points, registrations: da.registrations, online: da.registrationsOn })
            }, function() {
                var ranks = 1;
                User.findOneAndUpdate({ username: user[0].username }, { $set: { rank: ranks } }, function(err, result) {
                    if (err)
                        res.redirect("/ca-portal/admin/registrations");
                });
                for (i = 1; i < user.length; i++) {
                    if (user[i].points === user[i - 1].points && user[i].toRegis === user[i - 1].totRegis && user[i].registrations === user[i - 1].registrations)
                        User.findOneAndUpdate({ username: user[i].username }, { $set: { rank: ranks } }, function(err, result) {
                            if (err)
                                res.redirect("/ca-portal/admin/registrations");
                        });
                    else {
                        ranks = ranks + 1;
                        User.findOneAndUpdate({ username: user[i].username }, { $set: { rank: ranks } }, function(err, result) {
                            if (err)
                                res.redirect("/ca-portal/admin/registrations");
                        });
                    }
                }
            });
        }
    );
}

module.exports = router;
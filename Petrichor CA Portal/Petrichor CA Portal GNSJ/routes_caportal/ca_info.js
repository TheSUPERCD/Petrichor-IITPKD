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


router.get("/", function(req, res) {
    var detail_info = [];
    mongoose.connect(
        "mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        function(err, db) {
            rank_updation();
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
                User.findOneAndUpdate({ username: user[0].username }, { $set: { rank: ranks } },
                    function(err, result) {
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
                        console.log(ranks);
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
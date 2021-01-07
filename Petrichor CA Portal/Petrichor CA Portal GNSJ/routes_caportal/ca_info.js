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
            var details = db.collection("users").find();
            details.forEach(
                function(data, err) {
                    detail_info.push(data);
                },
                function() {
                    rank_updation();
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
            var data = db.collection("users").find().sort({ points: -1, registrations: -1 });
            data.forEach((da, err) => {
                user.push({ username: da.username, points: da.points, rank: 0, registrations: da.registrations })
                    // console.log(da)
            }, function() {
                for (i = 0; i < user.length; i++) {
                    p = parseInt(user[i].points);
                    if (p != 0) {
                        if (i > 0) {
                            if (p == parseInt(user[i - 1].points) && user[i].registrations == user[i - 1].registrations) {
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
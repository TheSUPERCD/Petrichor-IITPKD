var User = require("./models/user");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passportLocalMongoose = require("passport-local-mongoose");

function rank_updation() {
    var user = []
    mongoose.set('useFindAndModify', false);
    mongoose.connect(
        "mongodb+srv://caportal:caportal@cluster0.uyrou.mongodb.net/database?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        function(err, db) {
            var data = db.collection("users").find().sort({ points: -1 });
            data.forEach((da, err) => {
                user.push({ username: da.username, points: da.points, rank: 0 })
                console.log(da)
            }, function() {
                for (i = 0; i < user.length; i++) {
                    p = parseInt(user[i].points);
                    if (p != 0) {
                        if (i > 0) {
                            if (p != parseInt(user[i - 1].points)) {
                                user[i].rank = i + 1;
                                User.findOneAndUpdate({ username: user[i].username }, { $set: { rank: (i + 1).toString() } }, (err, results) => {
                                    console.log(results);
                                })
                            }
                        } else if (i == 0) {
                            user[i].rank = 1
                            User.findOneAndUpdate({ username: user[i].username }, { $set: { rank: 1 } }, (err, results) => {
                                console.log(results);
                            })
                        } else {
                            user[i].rank = user[i - 1].rank;
                            User.findOneAndUpdate({ username: user[i].username }, { $set: { rank: user[i].rank } }, (err, results) => {
                                console.log(results);
                            })
                        }
                    }
                }
            });
        }
    );
}

module.exports = { rank_updation }
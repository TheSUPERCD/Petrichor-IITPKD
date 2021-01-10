var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user')
var nodemailer = require('nodemailer');
var CryptoJS = require('crypto-js');
const user = require('./models/user');
var flush = require("connect-flash");
var crypto_key = 'secureKey';

app.use("/ca-portal/login", express.static("public"));
app.use("/ca-portal/dashboard", express.static("public"));
app.use("/ca-portal/registrations", express.static("public"));
app.use("/ca-portal/profile", express.static("public"));
app.use("/ca-portal/ca-information", express.static("public"));
app.use("/ca-portal/signup", express.static("public"));


var multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, req.user.username + '.png')
    }
})

var upload = multer({ storage: storage })
app.use("/uploads", express.static("uploads"));


var secret = require('./models/secret_keys.json');


var initial_reg = 0;
initial_rank = "Unranked";
initial_points = 0;

var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: secret.user,
        clientId: secret.clientId,
        clientSecret: secret.clientSecret,
        refreshToken: secret.refreshToken,
        accessToken: secret.accessToken
    }
});
var rand,mailOptions,host,link;


mongoose.connect('mongodb+srv://adminuser:adminpass@cluster0-c469f.mongodb.net/CA_Portal_Users?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});



app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));
app.use("/admin", express.static("public"));

passport.use(new localStrategy(User.authenticate()));
app.use(require('express-session')({
    secret: 'secret',
    cookie: { expires : false},
    resave: false,
    saveUninitialized: false
}));

app.use(flush())
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/ca-portal/dashboard", isLoggedIn, function(req, res) {
    var details;
    mongoose.connect(
        'mongodb+srv://adminuser:adminpass@cluster0-c469f.mongodb.net/CA_Portal_Users?retryWrites=true&w=majority', {
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


app.get('/ca-portal/login', isLoggedOut, function(req, res){
    res.render("login.ejs", { string: req.flash('error') });
});

app.get('/ca-portal/signup', isLoggedOut, function(req, res){
    res.render('signup.ejs', { string: req.flash('alert') });
});

app.get("/ca-portal/profile", isLoggedIn, function(req, res) {
    // var Image = "http://" + req.headers.host + "/uploads/" + req.user.username + '.png';
    // res.render("profile.ejs", { profile: Image, name: , college: , email: })
    User.findOne({ username: req.user.username }, function(err, result) {
        var Image = "http://" + req.headers.host + "/uploads/" + result.profileImage;
        res.render("profile.ejs", { profile: Image, name: result.name, college: result.college, email: result.email });
    });
});

app.get("/ca-portal/registrations", isLoggedIn, function(req, res) {
    res.render("Registrations.ejs");
});

app.get('/ca-portal/logout', isLoggedIn, function(req, res){
    req.logOut();
    req.flash('error', 'You have logged out successfully');
    res.redirect('/ca-portal/login');
});

app.get('/ca-portal/forgot',function(req, res){
    res.render('forgot_Password.ejs');
});



app.post('/ca-portal/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid Username or Passsword'}), function(req, res){
    if(req.user.isVerified){
        res.redirect('/ca-portal/dashboard');
    }
    else{
        req.logOut();
        req.flash('error', 'Please verify your email address first')
        res.redirect('/ca-portal/login');
    }
});

app.post('/ca-portal/signup', function(req, res){
    User.findOneAndRemove({email: req.body.email, isVerified: false}, function(err, docs){
        if(err){
            console.log('Error occured in cleansing unverified user operations');
        }
    });
    User.find({
        $and: [
            {isVerified : true},
            {$or: [
                {username:req.body.username},
                {email:req.body.email}
            ]}
        ]
    }, function(err, user){
        if(err){
            console.log('some error occurred');
        }
        else{
            if(user.length !== 0){
                req.flash('alert', 'Username or Email already in use');
                res.redirect('/ca-portal/signup'); // username or email already taken
            }
            else{
                // Registering user
                User.register(new User({
                    name:req.body.name,
                    username:req.body.username,
                    email:req.body.email,
                    isVerified:false,
                    college:req.body.clg,
                    points: initial_points,
                    registrations: initial_reg,
                    rank: initial_rank,
                    token_id: get_token(8),
                    changePassToken: 'INVALID',
                    profileImage: 'default.png',
                }),
                req.body.password, function(err, newuser){
                    if(err){
                        console.log('error in creating a new user');
                    }
                    else{
                        console.log('new user created');
                    }
                });


                // Sending verification email
                rand=CryptoJS.AES.encrypt(req.body.email, crypto_key).toString();
                host=req.get('host');
                link="http://"+req.get('host')+"/verify?id="+rand;
                mailOptions={
                    from : secret.user,
                    to : req.body.email,
                    subject : "Please confirm your Email account",
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                }
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                        req.flash('error', 'Error with sending the verfication mail');
                    }else{
                        console.log("Verification email sent to : "+req.body.email);
                        req.flash('error', 'Please verify your email before logging in');
                    }
                });
                res.redirect('/ca-portal/login');
            }
        }
    });
});

app.post('/ca-portal/profile_data_post', function(req, res){
    console.log('received profile info');
    res.redirect('/ca-portal/profile');
});


app.post('/uploadfile', isLoggedIn, upload.single('myFile'), (req, res, next) => {
    User.findOneAndUpdate({ username : req.user.username }, { $set: { profileImage: req.file.filename } }, function(err, result) {
        res.redirect("/ca-portal/profile");
    });
})



app.get('/verify',function(req,res){
    if((req.protocol+"://"+req.get('host'))==("http://"+host)){
        console.log("Domain is matched. Information is from Authentic email");
        console.log(req.query.id.replace(/\s/g, '+'));
        var toVerifyEmail = CryptoJS.AES.decrypt(req.query.id.replace(/\s/g, '+'), crypto_key).toString(CryptoJS.enc.Utf8);
        User.find({email: toVerifyEmail}, function(err, users){
            if(err){
                console.log(err);
            }
            else{
                if(users.length !== 0){
                    User.findOneAndUpdate({email: toVerifyEmail}, {isVerified: true}, function(err, result){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log('Email has been verified');
                            return res.send("<h1>Email "+toVerifyEmail+" is been Successfully verified");
                        }
                    });
                }
                else{
                    console.log("email is not verified");
                    res.send("<h1>Bad Request</h1>");
                }
            }
        });
    }
    else{
        res.send("<h1>Request is from unknown source");
    }
});

app.post('/forgot', function (req,res){
    var passToken = get_PassToken(6);
    rand=CryptoJS.AES.encrypt(req.body.email, crypto_key).toString();
    host=req.get('host');
    link="http://"+req.get('host')+'/changePass?id='+rand;
    mailOptions={
        from : secret.user,
        to : req.body.email,
        subject : "Request to  change your password",
        html : "Hello,<br> Please Click on this <a href="+link+">link</a>to change your password.<br>If you did not request this change of password, please ignore this email"
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }
    else{
        console.log("Password reset mail is sent");
    }
    });
    User.findOneAndUpdate({email: req.body.email}, {changePassToken: passToken}, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            console.log('PassToken updated successfully');
        }
    });
    req.flash('error', 'Password reset link has been sent');
    res.redirect('/ca-portal/login');
});

var forgot_email;
app.get('/changePass',function(req,res){
    if((req.protocol+"://"+req.get('host'))==("http://"+host)){
        console.log("Domain is matched. Information is from Authentic email");
        forgot_email = CryptoJS.AES.decrypt(req.query.id.replace(/\s/g, '+'), crypto_key).toString(CryptoJS.enc.Utf8);
        User.findOne({email: forgot_email}, function(err, user){
            if(err){
                console.log('bad request');
                res.send("<h1>Bad Request</h1>");
            }
            else if(user !== null){
                console.log('Password reset approved');
                res.render('change_Password.ejs', {token: '/changePassword/'+user.changePassToken});
            }
            else{
                res.send('<h1>User does not exist</h1>')
            }
        });
    }
    else{
        res.send("<h1>Request is from unknown source");
    }
});

app.post('/changePassword/:changePassToken', function(req, res){
    var passToken = req.params.changePassToken;
    User.findOne({email: forgot_email}, function(err, user){
        if(err){
            console.log(err);
        }
        else if(user.changePassToken !== passToken){
            res.send('<h1>Warning : Unauthorized Access</h1><h3>This incident will be reported</h3>');
        }
        else{
            User.findByIdAndRemove({_id: user.id}, 
                function(err, docs){
                 if(err){
                    console.log('error occured in user removing');
                 } 
                 else{
                    console.log('user removed');
                 }
             });
             User.register(new User({
                name:user.name,
                username:user.username,
                email:user.email,
                isVerified:user.isVerified,
                college:user.clg,
                points: user.points,
                registrations: user.registrations,
                rank: user.rank,
                token_id: user.token_id,
                changePassToken: 'INVALID',
            }),
            req.body.password, function(err, newuser){
                if(err){
                    console.log('error in creating a new user');
                }
                else{
                    res.send('<h1>Password Changed Successfully</h1>');
                }
            });
        }
    });
});



app.get("/admin/registrations", isLoggedIn, isAdmin, function(req, res) {
    res.render("rank_update.ejs", { message: req.flash('message') });
});

app.get("/admin/ca-information", isLoggedIn, isAdmin, function(req, res) {
    var detail_info = [];
    mongoose.connect(
        'mongodb+srv://adminuser:adminpass@cluster0-c469f.mongodb.net/CA_Portal_Users?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        function(err, db) {
            var details = db.collection("users").find();
            details.forEach(
                function(data, err) {
                    if(data.isVerified == true){
                        detail_info.push(data);
                    }
                },
                function() {
                    res.render("ca-details.ejs", { details: detail_info });
                }
            );
        }
    );
});

app.post("/admin/registrations", function(req, res) {
    var token = req.body.token;
    var num_reg = parseInt(req.body.registrations);
    var points = parseInt(req.body.points);
    User.findOneAndUpdate({ token_id: token }, { $inc: { registrations: num_reg, points: points } }, function(error, result) {
        if (error) {
            req.flash('message', 'Submission Failed');
            res.redirect("/admin/registrations");
        } else if (!result) {
            req.flash('message', 'Incorrect Details, No user Exists');
            res.redirect("/admin/registrations");
        } else {
            updateRanks();
            req.flash('message', 'Saved successfully');
            res.redirect("/admin/registrations");
        }
    });
});





app.get('/*', function(req, res){
    res.send('<h2>ERROR 404 :The page you requested does not exist !</h2>');
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/ca-portal/login');
    }
}

function isLoggedOut(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/ca-portal/dashboard');
    }
    else{
        return next();
    }
}

function isAdmin(req, res, next){
    if(req.user.username === 'TheSUPERCD'){
        return next();
    }
    else{
        res.send('You are not allowed to view this page');
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
    User.find({token_id : result}, function (err, user){
        if(err){
            console.log('some error occurred');
        }
        else{
            if(user.length === 0){
                console.log('No users with the token id found');
            }
            else{
                console.log('Users with the token id found');
                result = get_token(length);
            }
        }
    });
    return result;
}


function get_PassToken(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function updateRanks(){
    var detail_info = [];
    mongoose.connect(
        'mongodb+srv://adminuser:adminpass@cluster0-c469f.mongodb.net/CA_Portal_Users?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        function(err, db) {
            var details = db.collection("users").find();
            details.forEach(
                function(data, err) {
                    detail_info.push(data);
                },
                function(){
                    detail_info.sort(function(a,b){
                        if(a.points === b.points){
                            return b.registrations - a.registrations;
                        }
                        else{
                            return b.points - a.points;
                        }
                    });
                    for(var i=0; i<detail_info.length; i++){
                        if(detail_info[i].points !== 0){
                            User.findOneAndUpdate({ username: detail_info[i].username }, { rank: i+1 }, function(error, result) {
                                if (error) {
                                    console.log('some error occurred with updating ranks');
                                }
                                else if (!result) {
                                    console.log('Incorrect Details, No user Exists');
                                }
                            });
                        }
                    }
                }
            );
        }
    );
}



app.listen(8000, function(){
    console.log('Starting Server.....');
});

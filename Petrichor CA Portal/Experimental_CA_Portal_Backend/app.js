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

var initial_reg = 0;
initial_rank = "NIL";
initial_points = 0;

var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: "sandywill6969@gmail.com",
        clientId: "86824932391-necudl9qj9b35ueob5vb0k5na6s3e7jh.apps.googleusercontent.com",
        clientSecret: "TaKrqALt41aoYXy1eyMiOYn9",
        refreshToken: "1//04GxJeZghVU8UCgYIARAAGAQSNwF-L9Ir3DggPOYaPYnpFri2H_FlBxO-PW3uW0K-4F7iMsooQaSQEcHxDuH_-qqEPZlp23Ol2A8",
        accessToken: "ya29.a0AfH6SMCrlQoFAI2q0l2yDJJw5zzaB-GEGkIlWAkBWdT5pQbSdbnFHlMZuLRK5TXFcdWhKhZW6nf637AKg1y2Npam1ebXnKqPfAniw7fZ1FJn99z37n62cLS13-Fa2C_mgCPlF4gtEH_tIg_fBxb9s2X7HJk_aq6LDQM"
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



app.get("/dashboard", isLoggedIn, function(req, res) {
    var details;
    mongoose.connect(
        'mongodb+srv://adminuser:adminpass@cluster0-c469f.mongodb.net/CA_Portal_Users?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        function(err, db) {
            if (err) {
                res.redirect("/login");
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


app.get('/login', isLoggedOut, function(req, res){
    console.log('/login got a request sir.');
    res.render("login.ejs", { string: req.flash('error') });
});

app.get('/signup', isLoggedOut, function(req, res){
    console.log('/signup got a request sir.');
    res.render('signup.ejs', { string: req.flash('alert') });
});

app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile.ejs");
});

app.get("/registrations", isLoggedIn, function(req, res) {
    res.render("Registrations.ejs");
});

app.get('/logout', isLoggedIn, function(req, res){
    req.logOut();
    res.send('You have logged out successfully');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid Username or Passsword'}), function(req, res){
    if(req.user.isVerified){
        res.redirect('/dashboard');
    }
    else{
        req.logOut();
        res.send('<h1>Please verify your email address</h1>');
    }
});

app.post('/signup', function(req, res){
    User.find({
        $or: [
            {username:req.body.username},
            {email:req.body.email}
        ]
    }, function(err, user){
        if(err){
            console.log('some error occurred');
        }
        else{
            if(user.length !== 0){
                req.flash('alert', 'User Already Exists');
                res.redirect('/signup'); // username or email already taken
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
                }),
                req.body.password, function(err, newuser){
                    if(err){
                        console.log('error in creating a new user');
                    }
                    else{
                        console.log(newuser);
                    }
                });


                // Sending verification email
                rand=CryptoJS.AES.encrypt(req.body.email, crypto_key).toString();
                host=req.get('host');
                link="http://"+req.get('host')+"/verify?id="+rand;
                mailOptions={
                    from : 'sandywill6969@gmail.com',
                    to : req.body.email,
                    subject : "Please confirm your Email account",
                    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                        res.send("error");
                    }else{
                        console.log("Message sent: " + response.message);
                        res.send("Verification mail is sent");
                    }
                });


                res.redirect('/login')
            }
        }
    });
});

app.post('/profile_data_post', function(req, res){
    console.log('received profile info');
    res.redirect('/');
});






app.get('/verify',function(req,res){
    if((req.protocol+"://"+req.get('host'))==("http://"+host)){
        console.log("Domain is matched. Information is from Authentic email");
        console.log(req.query.id.replace(/\s/g, '+'));
        var toVerifyEmail = CryptoJS.AES.decrypt(req.query.id.replace(/\s/g, '+'), crypto_key).toString(CryptoJS.enc.Utf8);
        console.log(toVerifyEmail);
        var users = User.find({email: toVerifyEmail});
        if(users.length !== 0){
            console.log("email is verified");
            User.findOneAndUpdate({email: toVerifyEmail}, {isVerified: true}, function(err, result){
                if(err){
                    console.log(err);
                }
                else{
                    return res.send("<h1>Email "+toVerifyEmail+" is been Successfully verified");
                }
            });
        }
        else{
            console.log("email is not verified");
            res.send("<h1>Bad Request</h1>");
        }
    }
    else{
        res.send("<h1>Request is from unknown source");
    }
});

app.get("/admin/registrations", function(req, res) {
    res.render("rank_update.ejs", { message: req.flash('message') });
});

app.get("/ca-information", function(req, res) {
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
            req.flash('message', 'Saved successfully')
            res.redirect("/admin/registrations")
        }
    });
});





app.get('/*', function(req, res){
    res.send('ERROR 404 :The page you requested does not exist !');
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/login');
    }
}

function isLoggedOut(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/dashboard');
    }
    else{
        return next();
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
                get_token(length);
            }
        }
    });
    return result;
}

app.listen(8000, function(){
    console.log('Starting Server.....');
});




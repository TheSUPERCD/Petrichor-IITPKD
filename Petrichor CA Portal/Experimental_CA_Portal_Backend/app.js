var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user')
var nodemailer = require('nodemailer');
var CryptoJS = require('crypto-js');
const user = require('./models/user');
var crypto_key = 'secureKey';


var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sandywill6969@gmail.com",
        pass: "helloworld69"
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
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', isLoggedIn, function(req, res){
    console.log('/ got a request sir.');
    res.render('Profile_template.ejs');
});

app.get('/login', function(req, res){
    console.log('/login got a request sir.');
    res.render('Login_form.ejs');
});

app.get('/signup', function(req, res){
    console.log('/signup got a request sir.');
    res.render('signup.ejs');
});

app.get('/logout', isLoggedIn, function(req, res){
    req.logOut();
    res.send('You have logged out successfully');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), function(req, res){
    if(req.user.isVerified){
        res.redirect('/');
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
                res.redirect('/signup'); // username or email already taken
            }
            else{
                // Registering user
                User.register(new User({name:req.body.name, username:req.body.username, email:req.body.email, isVerified:false, college:req.body.clg}),
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







app.get('*', function(req, res){
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


app.listen(8000, function(){
    console.log('Starting Server.....');
});




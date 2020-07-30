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
const { db } = require('./models/user');
var crypto_key = 'secureKey';

var transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "pulavartivinay@gmail.com",
        pass: "EphB$2018"
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
});
var rand,host,link;


mongoose.connect('mongodb://localhost:27017/CA_Portal', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
passport.use(new localStrategy(User.authenticate()));
app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', function(req, res){
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

app.get('/forgot',function(req, res){
    console.log('/forgot password got a request sir.');
    res.render('forgot_Password.ejs');
});

app.get('/changePassword', function(req, res){
    console.log('/change password got a request sir.');
    res.render('change_Password.ejs');
});

app.get('/logout', function(req, res){
    req.logOut();
    res.send('You have logged out successfully');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}), function(req, res){
    if(req.user.isVerified){
        console.log("hey123")
        res.redirect('/signup');
    }
    else{
        console.log("hey")
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
                User.register(new User({name:req.body.name, username:req.body.username, email:req.body.email, college:req.body.clg}),
                req.body.password, function(err, newuser){
                    if(err){
                        console.log('error in creating a new user');
                    }
                    else{
                        console.log(newuser);
                    }
                });


                //Sending verification email
                // rand=CryptoJS.AES.encrypt(req.body.email, crypto_key);
                // host=req.get('host');
                // link="http://"+req.get('host')+"/verify?id="+rand;
                // mailOptions={
                //     from: 'pulavartivinay@gmail.com',
                //     to : req.body.email,
                //     subject : "Please confirm your Email account",
                //     html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
                // }
                // console.log(mailOptions);
                // smtpTransport.sendMail(mailOptions, function(error, response){
                //     if(error){
                //         console.log(error);
                //         res.send("error");
                //     }else{
                //         console.log("Message sent: " + response.message);
                //         res.send("Verification mail is sent");
                //     }
                // });


                res.redirect('/login')
            }
        }
    });
});

var forgot_email;
app.post('/forgot', function(req, res){
        forgot_email = req.body.email;
        rand=CryptoJS.AES.encrypt(req.body.email, crypto_key).toString();
        host=req.get('host');
        link="http://"+req.get('host')+"/intermediate?id="+rand;
        console.log(link);
        User.find({email: req.body.email},function(err,user){
            if(err){
                console.log("error occured in forgot page");
            }
            else{
                if(user.length != 0){       //existing user
                    res.send("Link has been sent to ur mail " + req.body.email);
                    sendmailcorrectly()
                }
                else{
                    res.redirect('/signup');
                }
            }
        });
        var mailOptions = {
            from: 'pulavartivinay@gmail.com',
            to: req.body.email,
            subject: 'Email verification step to proceed for reset password',
            text: `Please click the below link to reset ur password`,
            html: '<h1>Click this link</h1><a href = '+link+'>Reset Password</a>'
        };
        sendmailcorrectly = function(){
            transport.sendMail(mailOptions,function(error,response){
                if (error){
                    console.log(error);
                    console.log(mailOptions);
                }
                else{
                    console.log('Email sent: '+ response);
                }
            });
        }
});

app.post('/changePassword', function(req, res){
    var forgot_pass = req.body.password;
    console.log(forgot_email);
    console.log(forgot_pass);
    User.findOne({email: forgot_email}, function(err, user){
        if(err)return handleErr(err);
        var temp_name = user.name;
        var temp_username = user.username;
        var temp_email = user.email;
        var temp_college = user.college;
        User.findByIdAndRemove({_id: user.id}, 
            function(err, docs){
             if(err) console.log('error occured in user removing');
             else    console.log('user removed');;
         });
        User.register(new User({name:temp_name, username:temp_username, email:temp_email, college:temp_college}),
                forgot_pass, function(err, newuser){
                    if(err){
                        console.log('error in creating a new user');
                    }
                    else{
                        console.log(newuser);
                    }
                });
        // user.save(function(err){
        //    if(err)return handleErr(err);
        //    //user has been updated
        //  });
       });
    console.log('Password changed succesfully');
    // res.send("Password changed successfully !!!")
    res.redirect("/login");
});


app.post('/profile_data_post', function(req, res){
    console.log('received profile info');
    res.redirect('/');
});






// app.get('/verify',function(req,res){
//     console.log(req.protocol+":/"+req.get('host'));
//     if((req.protocol+"://"+req.get('host'))==("http://"+host)){
//         console.log("Domain is matched. Information is from Authentic email");
//         var users = User.find({email: CryptoJS.AES.decrypt(req.query.id, crypto_key).toString(CryptoJS.enc.Utf8)});
//         console.log(req.query.id);
//         if(users.length != 0){
//             console.log("email is verified");
//             res.send("<h1>Email "+mailOptions.to+" is been Successfully verified");
//         }
//         else{
//             console.log("email is not verified");
//             res.send("<h1>Bad Request</h1>");
//         }
//     }
//     else{
//         res.send("<h1>Request is from unknown source");
//     }
// });

app.get('/intermediate',function(req,res){
    if((req.protocol+"://"+req.get('host'))==("http://"+host)){
        console.log("Domain is matched. Information is from Authentic email");
        console.log(req.query.id.replace(/\s/g, '+'));
        var toVerifyEmail = CryptoJS.AES.decrypt(req.query.id.replace(/\s/g, '+'), crypto_key).toString(CryptoJS.enc.Utf8);
        console.log(toVerifyEmail);
        if(forgot_email == toVerifyEmail){
            res.redirect('/changePassword');
        }
        else{
            res.redirect('/signup');
        }     
    }
});







app.get('*', function(req, res){
    console.log('Invalid Page Accessed');
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


app.listen(27017, function(){
    console.log('Starting Server.....');
});

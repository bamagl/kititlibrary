

var express = require('express');
var passport = require('passport');
var Strategy = require('passport-google-oauth20').Strategy;
var mongoose = require('mongoose');

var graphqlHTTP = require('express-graphql');
var schema = require('./graphql/bookSchemas');
var cors = require("cors");
var User = require('./models/User');
var jwt=require('jsonwebtoken');

mongoose.connect('mongodb://localhost/node-graphql', { promiseLibrary: require('bluebird'), useNewUrlParser: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

passport.use(new Strategy({
    clientID: '614691795607-9rmra4fi1b36rpkc65vsbld9gt4dpraj.apps.googleusercontent.com',
    clientSecret: 'kIyU5VG_2cBDpm4VcSGwIVLY',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("access token")
    User.findOne({ 'email' : profile.emails[0].value }, function(err, user) {
      if (err) return cb(err);
      if (user) 
      {
       
        cb (null, {profile: profile,
          user: user});
      }
      else{
        cb(null,null);
      }
      /*else {
        // if there is no user found with that facebook id, create them
        var newUser = new User();
  
        // set all of the facebook information in our user model
        newUser.google.id = profile.id;
        newUser.google.token = accessToken;
        newUser.google.name  = profile.displayName;
        newUser.google.role= "teacher"
        if (typeof profile.emails != 'undefined' && profile.emails.length > 0)
          newUser.google.email = profile.emails[0].value;
  
        // save our user to the database
        newUser.save(function(err) {
          if (err) throw err;
          return cb(null, newUser);
        });
      }*/
    });

  //  return cb(null, profilenull);
  }));



passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {  
  cb(null, obj);
});


var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));


app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);


app.use('/graphql', (req, res) => {
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    context: { user:req.user }
  })(req, res)
})

/*app.use('/graphql',cors(), function(req,res){graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
  context:function(req){
    
    return {user:req.user}
  }
})
});*/

app.get('/',
  function(req, res) {   
    res.render('home', { user: req.user });
  });


app.get('/addbook',function(req,res){
  res.render('addbook');
  })


app.post('/addbook',function(req,res){
  console.log("post is calling");
  console.log(req.body.username)
})

app.get("/login/success", (req, res) => {
  if (req.user) {
    console.log(req.user)
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  }
});
app.get('/login',
  function(req, res){
    res.render('login');
  });
  app.get('/logout', (req, res) => {
  
    req.logout();
    req.user = null;
    res.redirect('http://localhost:3000/')
});  
app.use(express.static('public'))
app.get('/auth/google',
passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    
    res.redirect('http://localhost:3000/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

  
app.listen(process.env['PORT'] || 8080);
module.exports = app;
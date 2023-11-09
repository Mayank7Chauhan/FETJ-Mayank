// Import necessary modules
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const expressSession = require('express-session');

// Create an Express app
const app = express();

// Set up session middleware
app.use(expressSession({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use the Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: '584053183478-47o4vbfa4i51nvtge9vfh0l6c1ih8lih.apps.googleusercontent.com',
  clientSecret: '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', // Provide your actual client secret here
  callbackURL: 'http://localhost:3000/auth/google/callback',
},
(accessToken, refreshToken, profile, done) => {
  // Store user information in session
  return done(null, profile);
}));

// Serialize and deserialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Define routes

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  });

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('profile', { user: req.user });
  } else {
    res.redirect('/');
  }
});

app.get('/signout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
  

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

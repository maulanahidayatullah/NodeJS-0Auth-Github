const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const app = express();
const port = 5000;

let Token;

passport.use(new GitHubStrategy({
    clientID: '9d9a4c1d50e4ea0f37ed',
    clientSecret: '7ff84433102d29635118f6f48275845beea6b030',
    callbackURL: 'http://localhost:5000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    Token = accessToken;
    // Yang dilakukan setelah login 
    // Bisa ditambahkan jwt juga
    // console.log('AccessToken =' + accessToken);
    // console.log('RefreshToken =' + refreshToken);
    // console.log(user);
    return done(null, profile);
}));

// Serialize and deserialize user information
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(require('express-session')({ secret: 'asdcxbsdfgrgsz', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Route Authentication
app.get('/auth/github', passport.authenticate('github'));

// Callback
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile')
    }
);

app.get('/profile', (req, res) => {
    res.status(200).json({ access_token: Token })
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
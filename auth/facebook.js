var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
//var User = require('../models/User');
//dados de facebook: id do app 202791583668433
//chave de acesso a400af67bbb64e5a1cce74d12c11e787

passport.use(new FacebookStrategy({
    clientID: "202791583668433",
    clientSecret: "a400af67bbb64e5a1cce74d12c11e787",
    callbackURL: "http://127.0.0.1:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

module.exports = passport;

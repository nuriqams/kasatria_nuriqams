const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    done(null, { id }); // Replace with actual lookup if needed
  });

  passport.use(new GoogleStrategy({
    clientID: "685424294823-a8fvr00a93j8ic2eni4sq63oich7g7nr.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
    const user = { googleId: profile.id, name: profile.displayName };
    saveToGoogleSheet(user, (err) => {
      cb(err, user);
    });
  }));
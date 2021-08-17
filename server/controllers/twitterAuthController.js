const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;

// THIS is a bit funny about URLs - make sure you go to http://127.0.0.1:5000 --- INCLUDE THE HTTP..
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.CONSUMER_API,
      consumerSecret: process.env.CONSUMER_SECRET_KEY,
      callbackURL: "http://127.0.0.1:2222/api/auth/twitter/callback",
      userProfileURL:
        "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    },
    function (token, tokenSecret, profile, done) {
      // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return done(null, profile);
      // });
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
});

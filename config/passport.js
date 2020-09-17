var GoogleStrategy = require('passport-google-oauth20').Strategy
var model = require("../models/User")

module.exports = function(passport){
    passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
    },  
    async function(accessToken, refreshToken, profile, cb) {
        if (profile){
            let user = {
                googleID:profile.id,
                displayName:profile.displayName,
                lastName:profile.name.familyName,
                firstName:profile.name.givenName,
                image:profile.photos[0].value
            }
            try{
            let query_user = await model.findOne({googleID:user.googleID});
            console.log(query_user)
            if (query_user){
                cb(null, query_user)
            }else{
                cb(null,await model.create(user))
            }}catch(err){
            
            cb(err, false, { message: err.toString() })
            }
        }else{
            cb(err, false, { message: 'authentication error' })
        }
    }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
    passport.deserializeUser(function(id, done) {
        model.findById(id, function(err, user) {
        done(err, user);
    });
    });
}
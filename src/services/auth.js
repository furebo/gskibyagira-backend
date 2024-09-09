import passport from 'passport';

const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID ="952983179610-j65f12ajmemu7jdeoiu8c287gkes9il6.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_CALLBACK_URL = "http://localhost:3000";

passport.use(new GoogleStrategy({
    clientID:GOOGLE_CLIENT_ID,
    clientSecret:GOOGLE_CLIENT_SECRET,
    callbackURL:GOOGLE_CALLBACK_URL
},()=>{
   
}))
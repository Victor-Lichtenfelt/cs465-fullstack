const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const MySQL = require('../models/db');
const Password = require('../models/password');

//const mongoose = require("mongoose");
//const mysql = require('mysql');
//const users = require("../models/user");
//const User = mongoose.model("users");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },
        async (username, password, done) => {
            const user = await MySQL.viewSingleRowByTrait('users', 'email', username);

            //console.log("   U:", username);
            //console.log("   P:", password);
            

            if(!user) {
                return done(null, false, {
                    message: "Incorrect username."
                });
            }

            if(!Password.validPassword(password, user.hash, user.salt)) {
                return done(null, false, {
                    message: "Incorrect password."
                });
            }
            return done(null, user);
        }
    )
);

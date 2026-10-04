const passport = require('passport');
const MySQL = require('../models/db');
const Password = require('../models/password');

const register = async(req, res) => {
    //Validate message to insure that all parameters are present.
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({"message": "All fields required"});
    }

    let user = 
        {
            name: req.body.name,    // Set user name
            email: req.body.email,  // Set e-mail address
            ... Password.setPassword(req.body.password)
        };

    try
    {
        await MySQL.insertSingleRow('users',user);
        var qResult = await MySQL.viewSingleRowByTrait('users', 'email', req.body.email);
        user = {... user, ...{id: qResult.id}};

        if (!qResult)
        {
            //Database returned no data
            return res
                .status(400)
                .json({"message": "FailedToInsertAnything",
                    "datavalue": qResult
                });
        }
        else
        {
            const token = Password.generateJWT(user);
            return res
                .status(200)
                .json(token);
        }
    }
    catch (err)
    {
        return res
            .status(404)
            .json({"error": err});
    }
};

const login = (req, res) => {
    //Validate message to ensure that email and password are present.
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({"message": "All fields required"});
    }

    //Delegate authentication to passport module
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Error in Authentication Process
            return res
                .status(404)
                .json(err);
        }

        if (user) {
            // Auth succeeded - generate JWT and return to caller
            const token = Password.generateJWT(user);
            return res
                .status(200)
                .json({token});
        }
        else
        {
            // Auth failed return error.
            return res
                .status(401)
                .json(info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};
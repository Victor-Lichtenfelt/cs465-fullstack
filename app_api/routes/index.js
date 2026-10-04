const jwt = require('jsonwebtoken'); //Enable JSON Web Tokens

const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');
const authenController = require('../controllers/authentication');
const authorController = require('../controllers/authorization');

//Method to simplify our JWT:
function extractJWT(req, res, next) {
    console.log('In Middleware');

    const authHeader = req.headers['authorization'];
    console.log('   Auth Header: ' + authHeader);

    if(authHeader == null)
    {
        req.tokenError = 'Auth Header Required but NOT PRESENT!';
        req.HTMLcode = 401;
        next();
        return;
    }
   
    let headers = authHeader.split(' ');
    if(headers.length < 1)
    {
        req.tokenError = ('Not enough tokens in Auth Header: ' + headers.length);
        req.HTMLcode = 501;
        next();
        return;
    }

    const token = authHeader.split(' ')[1];
    console.log('   Token: ' + token);

    if(token == null)
    {
        req.tokenError = 'Null Bearer Token';
        req.HTMLcode = 401;
        next();
        return;
    }

    //console.log('?!?');
    //console.log(process.env.JWT_SECRET);
    //console.log(jwt.decode(token));

    const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if(err)
        {
            console.log('   Token Invalid!');
            req.json = 'Auth Header Required but NOT PRESENT!';
            req.HTMLcode = 401;
        }
        else
        {
            console.log('   Verified!');
            req.auth = verified;
        }
    });

    next(); //We need to continute or this will hang forever
}

//Method to authenticate our JWT:
function authenticateJWT(req, res, next) {
    ///console.log('In Middleware');

    if(req.auth == null)
    {
        if(req.tokenError != null)
        {
            console.log(req.tokenError);
        }

        if(req.json == null)
        {
            return res.sendStatus(req.HTMLcode);
        }

        return res.sendStatus(req.HTMLcode).json(req.json);
    }

    next(); //We need to coninute or this will hang forever
}


router.route("/login")
    .post(authenController.login);

router.route("/register")
    .post(authenController.register);

   
//Define route for out trips endpoint
router
    .route('/trips') 
    .get(extractJWT, authorController.extractQueryInfo ,  tripsController.tripsList)
    .post(extractJWT, authenticateJWT, authorController.extractUserInfo, tripsController.tripsAddTrip);

    /*
router
    .route('/trips/advancedQuery')
    .post(extractJWT, authorController.extractAdvancedQueryInfo, authorController.extractQueryInfo, tripsController.tripsList);

//GET Method routes tripsFindByCode - requires parameter
//PUT Method routes tripsUpdateTrip - requires parameter
*/

router
    .route('/trips/:tripCode')
    .get(extractJWT, authorController.extractQueryInfo, tripsController.tripsFindByCode)
    .put(extractJWT, authenticateJWT, authorController.extractEditInfo, tripsController.tripsUpdateTrip);

    
module.exports = router;
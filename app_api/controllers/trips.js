
const MySQL = require('../models/db');
const errorMessage = {message: "No elements selected."};

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async(req, res) => {
    console.log("Start tripsList Function");

    let q;

    try {
        console.log(req.query);
        q = await MySQL.viewRowsConditional('trips', req.query);
    }
    catch (err)
    {
        return res
            .status(404)
            .json(err);
    }


    // Uncomment the following line to show results of query
    // on the console.
    // console.log(q);

    if(!q)
    { //Database returned no data.
        return res
            .status(400)
            .json(errorMessage);
    } else { //Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

// GET: /trips/tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async(req, res) => {
    console.log("Start tripsFindByCode Function");

    let q;

    try {
        //console.log(req.query);
        var example = await MySQL.makeEqualCondition('code', req.params.tripCode);
        req.query.push(example);
        q = await MySQL.viewRowsConditional('trips', req.query);
        q[0].start = q[0].start.toISOString().split('T', 1)[0];
        //console.log(q[0].start);
    }
    catch (err)
    {
        return res
            .status(404)
            .json(err);
    }


    //Uncomment the following line to show results of query
    // on the console
    // console.log(q);

    if(!q)
    { // Database returned no data
        return res
            .status(400)
            .json(errorMessage);
    }
    else
    { // Return resulting trip list
        return res
            .status(200)
            .json(q[0]);
    }
};


//POST: /trips = Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async(req, res) => {
    const newTrip = {
        code: req.body.code,
        name: req.body.name,
        lengthDays: req.body.lengthDays,
        lengthNights: req.body.lengthNights,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
        publicity: req.body.publicity,
        author: req.userId
    };

    try
    {
        await MySQL.insertSingleRow('trips',newTrip);
    }
    catch (err)
    {
        return res
            .status(404)
            .json(err);
    }

    return res
        .status(201)
        .json({});
};


//PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async(req, res) => {

    // Uncomment for debugging
    //console.log(req.params);
    //console.log(req.body);

    const updateTrip = {
        code: req.body.code,
        name: req.body.name,
        lengthDays: req.body.lengthDays,
        lengthNights: req.body.lengthNights,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
        publicity: req.body.publicity
    };

    try
    {
        var example = await MySQL.makeEqualCondition('code', req.params.tripCode);
        req.edit.push(example);
        await MySQL.updateRowsConditional('trips',updateTrip, req.edit);
    }
    catch (err)
    {
        return res
            .status(404)
            .json(err);
    }
    
        
    return res
        .status(201)
        .json({});
};


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};


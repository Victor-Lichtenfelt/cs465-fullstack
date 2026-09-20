const mongoose = require('mongoose');
const Trip = require('../models/travlr'); //Register Model.
const TripModel = mongoose.model('trips');
const err = {message: "error"};

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async(req, res) => {

    console.log("Start tripsList Function");

    if(req.auth == null)
    {
        const q = await TripModel
        .find(
                {publicity: true}
            ) // Filter, return all public.
        .exec();

        console.log("In null, got public trips.");
    

        // Uncomment the following line to show results of query
        // on the console.
        // console.log(q);

        if(!q)
        { //Database returned no data.
            return res
                .status(404)
                .json(err);
        } else { //Return resulting trip list
            return res
                .status(200)
                .json(q);
        }
    }

    
    

    console.log("Got past null auth.");
    
    if(req.admin == true)
    {
        const q = await TripModel
            .find(
                    {}
                ) // No filter.
            .exec();

        if(!q)
        { //Database returned no data.
            return res
                .status(404)
                .json(err);
        } else { //Return resulting trip list
            return res
                .status(200)
                .json(q);
        }
    }

    console.log("Roles has no information.");

    const q = await TripModel
        .find(
                {$or:
                    [
                        {publicity: true},
                        {author: req.userId},
                        {editors: req.userId}
                    ]
                }
            ) // Filter, return all public or allowed to view.
        .exec();
    

    // Uncomment the following line to show results of query
    // on the console.
    // console.log(q);

    if(!q)
    { //Database returned no data.
        return res
            .status(404)
            .json(err);
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
    if(req.auth == null)
    {
        const q = await TripModel
            .find({'code' : req.params.tripCode, publicity: true}) //Return single record
            .exec();

        //Uncomment the following line to show results of query
        // on the console
        // console.log(q);

        if(!q)
        { // Database returned no data
            return res
                .status(404)
                .json(err);
        }
        else
        { // Return resulting trip list
            return res
                .status(200)
                .json(q);
        }
    }

    if(req.admin == true)
    {
        const q = await TripModel
            .find({'code' : req.params.tripCode}) //Return single record
            .exec();

        //Uncomment the following line to show results of query
        // on the console
        // console.log(q);

        if(!q)
        { // Database returned no data
            return res
                .status(404)
                .json(err);
        }
        else
        { // Return resulting trip list
            return res
                .status(200)
                .json(q);
        }
    }

    const q = await TripModel
        .find(
                {'code' : req.params.tripCode,
                    $or:
                        [
                            {publicity: true},
                            {author: req.userId},
                            {editors: req.userId}
                        ]
                }
            ) // Filter, return all public or allowed to view.
        .exec();
    

    // Uncomment the following line to show results of query
    // on the console.
    // console.log(q);

    if(!q)
    { //Database returned no data.
        return res
            .status(404)
            .json(err);
    } else { //Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

//POST: /trips = Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async(req, res) => {
    const newTrip = new Trip({
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description,
        publicity: req.body.publicity,
        author: req.userId
    });

    const q = await newTrip.save();

    if(!q)
    {
        return res
            .status(400)
            .json(err);
    }
    else
    {
        return res
            .status(201)
            .json(q);
    }
};

//PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async(req, res) => {

    // Uncomment for debugging
    //console.log(req.params);
    //console.log(req.body);
    
    if(req.admin != true)
    {
        const p = await TripModel
            .find(
                    {'code' : req.params.tripCode, $or:
                        [
                            {author: req.userId},
                            {editors: req.userId}
                        ]
                    }
                )
            .lean()
            .exec();

        if(!p || p.length === 0)
        {   
            return res
                .status(401)
                .json(err);
        }
    }

    const q = await TripModel
        .findOneAndUpdate(
            { 'code' : req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description,
                publicity: req.body.publicity
            }
        )
        .exec();
    
        if(!q)
        {
            return res
                .status(400)
                .json(err);
        }
        else
        {
            return res
                .status(201)
                .json(q);
        }

        //Uncomment the following line to show results of operation
        // on the console
        // console.log(q);
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};
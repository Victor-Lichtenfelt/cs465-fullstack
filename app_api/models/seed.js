//Bring in the DB connection and the Trip schema

const MySQL = require('./db');

//Read seed data from json file
var fs = require('fs');
//var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// delete any existing records, then insert seed data
const seedDB = async () => {
    await MySQL.removeAllRows('trips');

    var seedQuery = "INSERT INTO trips (code,name,lengthNights,lengthDays,start,resort"
    seedQuery += ",perPerson,image,description,publicity) VALUE (";

    seedQuery += "\"GALR210214\",";
    seedQuery += "\"Gale Reef\",";
    seedQuery += "4,";
    seedQuery += "5,";
    seedQuery += "\"2021-02-14\",";
    seedQuery += "\"Emerald Bay, 3 stars\",";
    seedQuery += "799.00,";
    seedQuery += "\"reef1.jpg\",";
    seedQuery += "\"<p>Gale Reef Sed et augue lorem. In sit amet placerat arcu. Mauris volutpat ipsum ac justo mollis vel vestibulum orci gravida. Vestibulum sit amet porttitor odio. Nulla facilisi. Fusce at pretium felis. </p> <p> Sed consequat libero ut turpis venenatis ut aliquam risus semper. Etiam convallis mi vel risus pretium sodales. Etiam nunc lorem ullamcorper vitae laoreet.</p>\",";
    seedQuery += "true";

    seedQuery += "), (";

    seedQuery += "\"DAWR210315\",";
    seedQuery += "\"Dawson's Reef\",";
    seedQuery += "4,";
    seedQuery += "5,";
    seedQuery += "\"2021-03-15\",";
    seedQuery += "\"Blue Lagoon, 4 stars\",";
    seedQuery += "1199.00,";
    seedQuery += "\"reef2.jpg\",";
    seedQuery += "\"<p>Dawson's Reef Integer magna leo, posuere et dignissim vitae, porttitor at odio. Pellentesque a metus nec magna placerat volutpat. Nunc nisi mi, elementum sit amet aliquet quis, tristique quis nisl. Curabitur odio lacus, blandit ut hendrerit</p> <p> vulputate, vulputate at est. Morbi aliquet viverra metus eu consectetur. In lorem dui, elementum sit amet convallis ac, tincidunt vel sapien. </p>\",";
    seedQuery += "true";
    

    seedQuery += "), (";

    seedQuery += "\"CLAR210621\",";
    seedQuery += "\"Claire's Reef\",";
    seedQuery += "4,";
    seedQuery += "5,";
    seedQuery += "\"2021-06-21\",";
    seedQuery += "\"Coral Sands, 5 stars\",";
    seedQuery += "1999.00,";
    seedQuery += "\"reef3.jpg\",";
    seedQuery += "\"<p>Claire's Reef Donec sed felis risus. Nulla facilisi. Donec a orci tellus, et auctor odio. Fusce ac orci nibh, quis semper arcu. Cras orci neque, euismod et accumsan ac, sagittis molestie lorem. Proin odio sapien, elementum at tempor non. </p> <p> Vulputate eget libero. In hac habitasse platea dictumst. Integer purus justo, egestas eu consectetur eu, cursus in tortor. Quisque nec nunc ac mi ultrices iaculis. </p>\",";
    seedQuery += "false";


    seedQuery += ")"

    await MySQL.con.promise().query(seedQuery);
};

//Close the MongoDB connection and exit
seedDB().then( async () => {

   MySQL.gracefulShutdown("Seeded Database");

    process.exit(0);
});
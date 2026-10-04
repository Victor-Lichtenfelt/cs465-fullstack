/*
const MySQL = require('./db');

class Trip
{

    Trip(input)
    {
        this.code = input.code;
        this.name = input.name;
        this.lengthNights = input.lengthNights;
        this.lengthDays = input.lengthDays;
        this.start = input.start;
        this.resort = input.resort;
        this.perPerson = input.perPerson;
        this.image = input.image;
        this.description = input.description;
        this.publicity = input.publicity;
        this.author = input.author;
    }

    async save()
    {
        await MySQL.query('INSERT INTO trips SET ?',);
    }
}

module.exports = Trip;


const mongoose = require('mongoose');
const mysql = require('mysql');
const user = require('./user');

//Define the trip schema
const tripSchema = new mongoose.Schema({
    code: { type: String, required: true, index: true},
    name: { type: String, required: true, index: true},
    length: { type: String, required: true},
    start: { type: Date, required: true},
    resort: { type: String, required: true},
    perPerson: { type: String, required: true},
    image: { type: String, required: true},
    description: { type: String, required: true},
    publicity: { type: Boolean, required: true},
    author: {
            type: mongoose.Types.ObjectId,
            ref: user
        },
    editors:[{
        type: mongoose.Types.ObjectId,
        ref: user
    }]
});

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;
*/